/**
* @name DetectWineGames
* @author ZwS
* @license Apache-2.0 license
* @description Allows discord o tetect games launched via Wine as if it was native.
* @version 1.0.0
*/

const Dispatcher = BdApi.Webpack.getModule(m => m.dispatch && m.subscribe);
const Patcher = BdApi.Patcher;


module.exports = class DetectWineGames {
    start() {
        BdApi.Patcher.before("DetectWineGames", Dispatcher, "dispatch", (that, args) => {
            const [ event ] = args;
            if (event.type === "GAMES_DATABASE_UPDATE") {
                event.games.forEach((game) => {
                    let linuxExecutable = game.executables?.find((e) => e.os == "linux");
                    let winExecutable = game.executables?.find((e) => e.os == "win32");
                    if (!linuxExecutable && !!winExecutable) {
                        linuxExecutable = Object.assign({}, winExecutable);
                        linuxExecutable.os = "linux";
                        
                        game.executables.push(linuxExecutable);
                    }
                })
            }
        });
    }
    
    stop() {
        Patcher.unpatchAll("DetectWineGames");
    }
};
