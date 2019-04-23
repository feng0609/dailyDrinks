// 加入購物車的產品規格
export default class item {
    constructor() {
         this.buyerName = null;
         this.qnt = 1;
         this.price = 0;
         this.sweet = 10;
         this.ice = 10;
         this.remark = null;
         this.product = null;
         this.seq = 0;  //add new item
         this.subTotal = 0;
         this.isPay = false;
    }
}