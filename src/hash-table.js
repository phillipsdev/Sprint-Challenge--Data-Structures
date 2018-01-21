/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { LimitedArray, getIndexBelowMax, LinkedList } = require('./hash-table-helpers');

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }

  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    oldStorage.each((bucket) => {
      if (!bucket) return;
      bucket.forEach((pair) => {
        this.insert(pair[0], pair[1]);
      });
    });
  }

  capacityIsFull() {
    let fullCells = 0;
    this.storage.each((bucket) => {
      if (bucket !== undefined) fullCells++;
    });
    return fullCells / this.limit >= 0.75;
  }

  // Adds the given key, value pair to the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // If no bucket has been created for that index, instantiate a new bucket and add the key, value pair to that new bucket
  // If the key already exists in the bucket, the newer value should overwrite the older value associated with that key
  insert(key, value) {
    if (this.capacityIsFull()) this.resize();
    const index = getIndexBelowMax(key.toString(), this.limit);
    if (!this.storage.get(index)) {
      const bucket = new LinkedList();
      bucket.addToTail([key, value]);
      this.storage.set(index, bucket);
    }
    if (this.storage.get(index)) {
      const bucket = index;
      let keyNode = false;
      let current = bucket.head;
      while ((current.next !== null) && (!keyNode)) {
        if (current.value[0] === key) {
          current.value[1] = value;
          keyNode = true;
        }
        current = current.next;
      }
      if (!keyNode) {
        bucket.addToTail([key, value]);
      }
    }
  }
  // Removes the key, value pair from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Remove the key, value pair from the bucket
  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket) {
      let found = false;
      if (bucket.head.value[0] === key) {
        bucket.removeHead();
        found = true;
      }
      let previous = bucket.head;
      let current = previous.next;
      while ((current !== null) && (!found)) {
        if (current.value[0] === key) {
          previous.next = current.next;
          current.next = null;
          found = true;
          if (bucket.tail === current) {
            bucket.tail = previous;
          }
        }
        if (!found) {
          previous = current;
          current = current.next;
        }
      }
    }
  }
  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket) {
      let scan = bucket.head;
      let found = false;
      while (scan.next !== null) {
        if (scan.value[0] === key) {
          found = true;
          return scan.value[1];
        }
        scan = scan.next;
      }
      if (!found) {
        return undefined;
      }
    }
  }
}

module.exports = HashTable;
