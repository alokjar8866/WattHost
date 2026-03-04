const MAX_LENGTH = 5;

export default function generateStr(){
    let ans = "";
    const subset = "123456789zxcvbnmlkjhgfdsaqwertyuiop";

    for (let i = 0; i < MAX_LENGTH; i++) {
       ans += subset[Math.floor(Math.random()*subset.length)]
    }

    return ans;
}