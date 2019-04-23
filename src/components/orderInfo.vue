<template>
    <div>
        <v-card>
            <v-card-title>
                <span class="headline">訂購清單 總金額 {{subTotal}}</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md v-if="order!==null">
                    <v-layout wrap>
                        <v-flex xs12 md4>
                            <v-text-field label="*姓名" required v-model="order.buyerName"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-select :items="items" label="*品名" item-text="name" v-model="order.product"></v-select>
                        </v-flex>
                        <v-flex xs12 md4>
                            <v-text-field label="單價" required v-model="order.price" disabled></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-text-field label="*數量" required v-model="order.qnt"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-select :items="[0,3,5,7,10]" v-model="order.sweet" label="甜度" required></v-select>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-select :items="[0,3,5,7,10]" v-model="order.ice" label="冰塊" required></v-select>
                        </v-flex>
                        *表示必填欄位
                    </v-layout>
                    <v-layout>
                        <v-textarea label="備註" v-model="order.remark"></v-textarea>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="saveData()">購買</v-btn>
                <v-btn color="blue darken-1" flat @click="close()">離開</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import itemClass from './item.js';

    export default {
        name: 'orderInfo',
        props: {
            // 訂單資訊如果新增為null
            orderData: Object
        },
        data: () => ({
            order: null,
            items: [{
                name: '綠茶',
                price: '35'
            }, {
                name: '紅茶',
                price: '35'
            }, {
                name: '奶茶',
                price: '35'
            }]
        }),
        mounted() {
        },
        watch: {
            orderData: function (order) {
                if (order === null) {
                    this.order = new itemClass();
                } else {
                    this.order = {...order};
                }
            },
            'order.product': function (value) {
                if (value !== null && value !== undefined) {
                    let product = this.items.find(function (element) {
                        return element.name === value;
                    });
                    if (product !== null && this.order !== null) {
                        this.order.price = product.price;
                    }
                }
            },
        },
        methods: {
            close() {
                this.$emit('close-dialog');
                this.orderData = null;
            },
            saveData() {
                try {
                    this.order.subTotal = this.subTotal;
                    this.checkValue();
                    this.$emit('save-data', this.order);
                    this.orderData = null;
                } catch (e) {
                    alert(e.message);
                }
            },
            checkValue() {
                try {
                    this.isNull('姓名', this.order.buyerName);
                    this.isNull('品項', this.order.product);
                    this.isZero('單價', this.order.price);
                    this.isZero('數量', this.order.qnt);
                    this.isNum('數量', this.order.qnt);
                    this.isNum('甜度', this.order.sweet);
                    this.isNum('冰量', this.order.ice);
                    this.isZero('總金額', this.order.subTotal);
                } catch (e) {
                    throw e;
                }
            },
            isNull(tag, value) {
                try {
                    if (value === null || value === undefined)
                        throw new Error(`${tag}不能為空值`);
                } catch (e) {
                    throw e;
                }
            },
            isZero(tag, value) {
                try {
                    if (Number(value) === 0)
                        throw new Error(`${tag}不能為0`);
                } catch (e) {
                    throw e;
                }
            },
            isNum(tag, value) {
                try {
                    if (Number.isInteger(Number(value)) === false)
                        throw new Error(`${tag}只能是數字`);
                } catch (e) {
                    throw e;
                }
            },
        },
        computed: {
            subTotal: function () {
                if (this.order === null || this.order.price === undefined || this.order.qnt === undefined) {
                    return 0;
                } else {
                    return Number(this.order.price) * Number(this.order.qnt);
                }
            }
        }
    }
</script>