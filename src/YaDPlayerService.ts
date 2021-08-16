export const yandexDiskPlayerService = {
	setConfiguration(configuration = null, environment = "dev"){
		this.serviceHost = (environment === "production")? 
							//configuration.mathParserServiceUrlProd
                            "https://yadplayer.herokuapp.com": 
							"https://localhost:5001";
                            //configuration.mathParserServiceUrlLocal;
	},

    serviceHost: "",
    getUserInfo: async function(accessToken: string){
        const response = await fetch(`${this.serviceHost}/User/getUserInfo`, {
            headers:{
            "Authorization": "Bearer " + accessToken
            }
        })

        if(response.status == 401)
            return {
            isAuthorized: false
            };

        const json = await response.json();
        json.isAuthorized = true;
        return json;
    },

    getToken: async function (code: string) {
        const response = await fetch(`${this.serviceHost}/Auth/getToken?code=` + code);
        const json = await response.json();
    
        return json;
    },

    getUrl: async function (accessToken: string, path: string) {
        const encodedPath = encodeURIComponent(path);
        const response = await fetch(`${this.serviceHost}/file/getUrl?path=` + encodedPath, {
        headers:{
            "Authorization": "Bearer " + accessToken
        }
        });
        if(response.status == 401){
            alert("Unauthorized");
            return;
        }

        if(response.status != 200)
        {
            alert("Error code " + response.status);
            return;
        }

        return await response.json();
    },

    getFiles: async function(accessToken: string, path: string, page: Number){
        const response = await fetch(`${this.serviceHost}/file/get?parentFolderPath=${encodeURIComponent(path)}&search=&page=${page}`,{
        headers:{
            "Authorization": "Bearer " + accessToken
        }
        });

        if(response.status == 401) {
            alert("Unauthorized");
            return;
        }

        if(response.status != 200) {
            alert("Error code " + response.status);
            return;
        }

        return await response.json();
    },

	myFetch: async function(url: string, body: any){
		const response = await fetch(this.serviceHost + url,
		{
			method: "post",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(body)
		});

		return await getResponseContent(response);
	}
};

async function getResponseContent(response: Response) {
	let content = null;
			
	if(response.status === 200 || 
		response.headers.get("content-type")?.includes("application/json"))
		content = await response.json();
	else 
		content = await response.text();

	const result = {
		status : response.status,
		content: content,
		contentType: response.headers.get("content-type")
	};

	return result;
}