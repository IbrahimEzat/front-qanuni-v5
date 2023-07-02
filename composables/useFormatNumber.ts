
export default (number:number) => {
    if(number/1000000 > 1)
        return number % 1000000 === 0 ? number/1000000 + 'M': Number.parseFloat(number/1000000 + '').toFixed(2) + 'M';
    if(number/1000 > 1)
    return number % 1000 === 0 ? number/1000 + 'K': Number.parseFloat(number/1000 + '').toFixed(2) + 'K';
    return number;    
}