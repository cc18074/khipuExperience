import { Sprite } from "pixi.js";

class Node {
    spriteVal: Sprite;
    next: null;
    prev: null;
    constructor(spriteVal: Sprite){
        this.spriteVal = spriteVal 
        this.next = null;
        this.prev = null;
    }
}

export class DoublyLinkedList {
    length: number;
    head: any;
    tail: any;
  
    constructor(){
        this.length = 0;
        this.head = null;
        this.tail = null;
    }
   

    append(sprite: Sprite){
    const newNode = new Node(sprite);
    if(this.length === 0){
        this.head = newNode;
        this.tail = newNode;
    }

    else{
        this.head.next = newNode;
        newNode.prev = this.head;
    }
    this.length++;
    }

    pop(){
        if(!this.tail){
            return null;
        }
        const removedNode = this.tail;
        if(this.length === 1){
           this.head = null;
           this.tail = null; 
        }
        else {
            this.tail = removedNode.prev;
            this.tail.next = null;
            removedNode.prev = null;
        }
        this.length--;
    }
}


