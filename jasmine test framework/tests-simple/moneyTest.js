import formatCurrency from "../../script/utils/money.js";

console.log('test suite: formatCurrency')

console.log('convert cent into dollars')
if(formatCurrency(2095) === '20.95'){
  console.log('passad')
} else {
  console.log('failed')
}
 
console.log('work with 0')

if(formatCurrency(0) === '0.0'){
 console.log('passed')
} else {
  console.log('failed')
} 

console.log('round up to the nearest cent')

 if(formatCurrency(2000.5) === '20.01'){

  console.log('passed')
} else {
  console.log('failed')  
}