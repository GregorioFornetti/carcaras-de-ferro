export function Collisor(obj1, obj2) {
    // obj1.texture.key
    const obj1type = obj1.texture.key;
    const obj2type = obj2.texture.key;
    // Terá "ifs" para identificar o que colidiu, e tratar de acordo com a ocorrência
    if(obj1type == "bullet"){
        const input = {bullet: getKeyByValue(this.bulletsEntities,obj1), enemy: getKeyByValue(this.enemiesEntities,obj2)}
        this.room.send("bulletHitEnemy",input);
        console.log("bullet hit enemy");
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}