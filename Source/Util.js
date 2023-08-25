/**
 * Find index of a sorted array, to insert an item https://stackoverflow.com/a/29018745
 * @param {*[]} sortedArr Array must be already sorted
 * @param {*} target target value
 * @param {*} compareFn compare function applicable to target and sortedArr items
 */
function bSearchIndex (sortedArr, target, compareFn){
    let botIdx=0;
    let topIdx=sortedArr.length-1;
    while (botIdx <= topIdx) {
        midIdx = (botIdx + topIdx) >> 1;
        let cmp = compareFn (target, sortedArr[midIdx]);
        if (cmp==0) {
            return midIdx;
        }
        else if (cmp<0){
            topIdx=midIdx-1;
        }
        else {
            botIdx=midIdx+1;
        }
    }
    return botIdx
}

/**
 * Array that is able to maintain order after insert/removal, and is able to bsearch location for that
 * Note: probably not serializable (i.e. not friendly for saves) 
 * @param {*} compareFn Comparison function (returns negative, positive, or 0 when comparing first operand to second)
 * @param {*} items initial array of items the same type as compareFn arguments
 * @returns 
 */
function newSortedArray(compareFn, items=[]) {
    return {
        add: function(target) {
            items.splice(bSearchIndex(items, target, compareFn),0,target)
            return target;
        },
        remove: function(target){
            let i=bSearchIndex(items, target, compareFn);
            if(i!==null && compareFn(target,items[i]) == 0){
                items.splice(bSearchIndex(items, target, compareFn),1);
                return true
            }
            else {
                return false;
            }       
        },
        get: function(target) {
            let i=bSearchIndex(items, target, compareFn);
            if(compareFn(target,items[i]) == 0){
                return i;
            }
            else {
                return null;
            }
        },
        getAll: function() {
            return items;
        }
    }
}