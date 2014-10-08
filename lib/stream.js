function Stream(array) {
    this.array = array;
    this.currentIndex = 0;
}

Stream.prototype.next = function() {
    return this.array[this.currentIndex++];
};

module.exports = Stream;
