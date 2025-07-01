function test(arr:any[]){
    for (const i in arr){
        console.log(i);
    }
}

const item = [1,2,3,4,5];
const item2 = 'hello';
test(item);