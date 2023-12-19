

export default class ScoreHUD extends Phaser.Scene {
    displayScore(score, x, y, flow, color, scale, scoreNumbersGap) {
        if (flow === 'left') {
            return this.displayScoreLeft(score, x, y, color, scale, scoreNumbersGap)
        } else if (flow === 'right') {
            return this.displayScoreRight(score, x, y, color, scale, scoreNumbersGap)
        }
    }

    displayScoreLeft(score, x, y, color, scale, scoreNumbersGap) {
        let scoreString = score.toString()
        let scoreSprites = []
        let scoreSpritesX = x
    
        for (let i = 0; i < scoreString.length; i++) {
            scoreSprites.push(
                this.add.image(scoreSpritesX, y, 'number_' + scoreString[i])
                .setScale(scale)
                .setTint(color)
            )
            scoreSpritesX += scoreNumbersGap
        }
    
        return scoreSprites
    }
    

    displayScoreRight(score, x, y, color, scale, scoreNumbersGap) {
        let scoreString = score.toString()
        let scoreSprites = []
        let scoreSpritesX = x
    
        for (let i = scoreString.length - 1; i >= 0; i--) {
            scoreSprites.push(
                this.add.image(scoreSpritesX, y, 'number_' + scoreString[i])
                .setScale(scale)
                .setTint(color)
            )
            scoreSpritesX -= scoreNumbersGap
        }
    
        return scoreSprites
    }
}