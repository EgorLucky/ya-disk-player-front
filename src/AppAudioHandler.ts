import App from './App';

class AppAudioHandler{
    component: App;
    yandexDiskPlayerService: any;

    constructor(app: App, yandexDiskPlayerService: any){
        this.component = app;
        this.yandexDiskPlayerService = yandexDiskPlayerService;
    }

    setPlayingAudio = async (audio: any) => {
        if(audio.path == null)
        audio.path = "";
          
        const accessToken = localStorage.getItem("accessToken") as string;
    
        const json = await this.yandexDiskPlayerService.getUrl(accessToken, audio.path);
    
        this.component.setState({
          currentAudioUrl: json.href,
          currentAudio: audio, 
          playingFolder: audio.parentFolderPath
        })
    }
    
    fileClicked = async (e: any) => {
        if(e.type == 'folder'){
            await this.getFolderContent(e.path, true, 1);
        }
        else
            await this.setPlayingAudio(e);
    }
    
    setNextUrl = async (audio: any, random: boolean) => {
        if(random) {

        }
        else {
            let playingFolder = this.component.state
                                    .folders
                                    .filter((f: any) => f.name == this.component.state.playingFolder)[0];

            let files = playingFolder
                            .files
                            .filter((f: any) => f.type == "file")
                            .map((f: any) => f.path);
            const currentIndex = files.indexOf(audio.path);
            if(currentIndex < 0)
            return;

            let nextIndex = currentIndex + 1;

            if(nextIndex >= files.length){
            await this.getFolderContent(this.component.state.playingFolder as string, true, playingFolder.page + 1);
            playingFolder = this.component.state
                                    .folders
                                    .filter((f: any) => f.name == this.component.state.playingFolder)[0];

            files = playingFolder
                            .files
                            .filter((f: any) => f.type == "file")
                            .map((f: any) => f.path);

            if(files.length >= nextIndex)
                nextIndex = 0;
            }

            const nextPath = files[nextIndex];
            const nextAudio = playingFolder
                                .files
                                .filter((f: any) => f.path == nextPath)[0];

            await this.setPlayingAudio(nextAudio);

        }
    }
    
    getFolderContent = async (path: string, forward: boolean, page: number) => {
        if(path == null)
            path = "";

        const folderStack = this.component.state?.folderStack == null? 
                        []
                        : this.component.state?.folderStack;

        if(page == 1 || forward == false) {
            if(forward == true) {
            folderStack.push(path);
            if(this.component.state?.folderStack == null)
                folderStack.last = () =>  folderStack[folderStack.length - 1];
            }
            else {
            folderStack.pop();
            path = folderStack.last();
            }
        }

        this.component.setState({
            explorerPage: page,
            folderStack: folderStack
        });

        if(path == this.component.state?.playingFolder && page == 1){
            this.component.setState({
            currentPath: path,
            explorerPage: this.component.state
                            .folders
                            .filter((f: any) => f.name == this.component.state.playingFolder)[0]
                            .page,
            });
        }
        else {
            const accessToken = localStorage.getItem("accessToken");

            if(accessToken == null)
            {
            alert("Unauthorized");
            return;
            }
            const json = (await this.yandexDiskPlayerService.getFiles(accessToken, path, page))
                        .map((j: any) => 
                        {
                            j.onClick = () => this.fileClicked(j);
                            return j;
                        });
            if(page != 1) {
            const folder = this.component.state
                                ?.folders
                                .filter((f: any) => f.name == path)
                                [0];
            folder.page = page;
            
            const files = folder.files;
            json.map((j: any) => files.push(j));
            this.component.setState({
                folders: this.component.state?.folders,
                currentPath: path
            });
            }
            else {
            const folders = this.component.state?.folders ?? [];

            if(folders.filter((f: any) => f.name == path).length == 0)
                folders.push({name: path, files: json, page: page});

            this.component.setState({
                folders: folders,
                currentPath: path
            });
            }
        }
    }
}

export default AppAudioHandler;