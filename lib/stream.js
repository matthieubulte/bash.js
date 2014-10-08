function Stream(array) {
    this.array = array;
    this.currentIndex = 0;
}

Stream.prototype.next = function() {
    return this.array[this.currentIndex++];
};

Stream.prototype.hasNext = function() {
    return this.currentIndex < this.array.length;
};

module.exports = Stream;
