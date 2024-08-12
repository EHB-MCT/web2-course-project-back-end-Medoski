// Made a class Game
class Game {

    constructor(userId, gameId, gameImg, gameName, gameRelease) {
        this.userId = userId;
        this.gameId = gameId;
        this.gameImg = gameImg;
        this.gameName = gameName;
        this.gameRelease = gameRelease;
    }

}

module.exports = Game;