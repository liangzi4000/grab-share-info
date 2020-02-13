/* let A = [-10, -5, -14,-1,5];
let part1index = 1;
let part2index = 1;
let part1sum = A[0];
let part2sum = A[A.length -1];
for (let i = 1; i < A.length - 1; i++) {
    if (part1index + part1index <= A.length) {
        let tmp1 = Math.abs(part1sum + A[part1index] - part2sum);
        let tmp2 = Math.abs(part1sum - (part2sum + A[A.length - 1 - part2index]));
        if (tmp1 >= tmp2) {
            part2sum += A[A.length - 1 - part2index];
            part2index++;
        } else {
            part1sum += A[part1index];
            part1index++;
        }
    }
}
console.log(Math.abs(part1sum-part2sum)); */

/////////////////////////////////////////////////////////////////////////
/* let A = "test 5 a0A pass007 ?xy1";
let sh = A.split(' ').map((i)=>{
    if(isvalid(i)) {return i.length;} else {return -1;}
});
function isvalid(str){
    let strletters = str;
    let strdigiters = str;
    return /^[A-Z0-9a-z]+$/g.test(str) && (strletters.replace(/[0-9]/g,'').length)%2 === 0 && (strdigiters.replace(/[a-zA-Z]/g,'').length)%2 === 1 
}
console.log(Math.max(...sh)); */
/////////////////////////////////////////////////////////////////////////
/* function solution(P, C) {
    return Math.min(Math.floor(P / 2), C);
}
console.log(solution(5,3)); */
/////////////////////////////////////////////////////////////////////////
/* 
function solution(K, C, D) {
    let C_sorted = C.slice().sort();
    let D_copy = D.slice();
    let result = [];
    for (let i = 0; i < C.length - 1; i++) {
        if (C_sorted[i] == C_sorted[i + 1]) {
            result.push(C_sorted[i]);
            i++;
        }
    }
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < 2; j++)
            C.splice(C.indexOf(result[i]), 1);
    }
    for (let i = 0; i < C.length; i++) {
        if (D.indexOf(C[i]) > -1 && K > 0) {
            result.push(C[i]);
            D_copy.splice(D_copy.indexOf(C[i]), 1);
            K--;
        }
    }
    D_copy.sort();
    for (let i = 0; i < D_copy.length - 1; i++) {
        if (D_copy[i] == D_copy[i + 1] && K > 1) {
            result.push(D_copy[i]);
            i++;
            K = K - 2;
        }
    }
}
solution(0, [1, 2, 1, 1, 4, 1, 2], [1, 4, 3, 2, 4]);
 */

// Permutation
function solution(arr) {
    let arrused = [];
    let result = [];
    function permute(arr) {
        for (let i = 0; i < arr.length; i++) {
            let elem = arr.splice(i, 1)[0];
            arrused.push(elem);
            if (arr.length == 0) {
                result.push(arrused.slice());
            }
            permute(arr);
            arr.splice(i, 0, elem);
            arrused.pop();
        }
    }
    permute(arr);
    console.dir(result);
    console.log(result.length);
}
solution(['A','B','C','D','E','F','G','H','I','J'])