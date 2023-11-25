export function CollisorPlayerEnemy(player, enemy) {
    const collisionMsg = {
        "playerId": getKeyByValue(this.playerEntities, player),
        "enemyId": getKeyByValue(this.enemiesEntities, enemy)
    }
    this.room.send("enemyHitPlayer", collisionMsg);
}

export function CollisorBulletEnemy(bullet, enemy) {
    if(bullet.data.values.owner !== this.room.sessionId || bullet.data.values.sent) {
        return;
    }

    bullet.setData('sent', true)

    const collisionMsg = {
        "bulletId": getKeyByValue(this.bulletsEntities, bullet),
        "enemyId": getKeyByValue(this.enemiesEntities, enemy)
    }

    this.room.send("bulletHitEnemy", collisionMsg);
}

export function CollisorPlayerBullet(player, bullet) {
    if (bullet.data.values.owner in this.playerEntities) {
        return;
    }

    const collisionMsg = {
        "bulletId": getKeyByValue(this.bulletsEntities, bullet),
        "playerId": getKeyByValue(this.enemiesEntities, enemy)
    }
    this.room.send("bulletHitPlayer", collisionMsg);

}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}