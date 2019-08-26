<template lang="pug">
  #app
    .container
      label
        | Nickname
        input(type="text",placeholder="Nickname",v-model="userName")

      button.main-btn(v-on:click="buttonClick")

      label
        | Url
        input(type="text",v-model="url")

      .log
        p(v-html="logs.join('<br>')")

      label
        | Mode
        select(v-model="mode",v-on:click="changeMode")
          option(v-for="(item,key) in modeList" :value="key") {{ item.label }}

      button(v-on:click="reset") リセット

</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import firebase from 'firebase';

    @Component({
        components: {},
    })
    export default class App extends Vue {
        userName: string = "";
        url: string = "";
        log: string = "";
        logs: string[] = [];
        already: boolean = false;

        roomId: string = "";
        userId: string = "";

        ref: any = null;

        mode: number = 1;
        modeList: any = {
            1: {label: "早押し"},
            2: {label: "test2"},
            3: {label: "tes3"},
            4: {label: "test4"},
        };

        firstUserId: string = "";

        mounted() {
            this.roomId = location.search.substr(1);
            if (!this.roomId) {
                firebase.firestore().collection("rooms")
                    .add({timestamp: firebase.firestore.Timestamp.now()})
                    .then((ref: any) => {
                        location.search = ref.id;
                    });
                return;
            }
            // check room
            firebase.firestore().collection("rooms").doc(this.roomId).get().then((qss: any) => {
                if (qss.data()) {
                    this.connectRoom();
                } else {
                    firebase.firestore().collection("rooms").doc(this.roomId)
                        .set({timestamp: firebase.firestore.Timestamp.now()})
                        .then((qss) => {
                            this.connectRoom();
                        });
                }
            });
        }

        buttonClick() {
            console.log("click");
            firebase.firestore().doc(`rooms/${this.roomId}/users/${this.userId}`)
                .update({
                    name: this.userName
                    , already: true
                    , timestamp: firebase.firestore.Timestamp.now()
                });
            this.pushLog("押した！");
        }

        private reset() {
            this.pushLog("リセット");
        }

        private connectRoom() {
            // firebase.firestore().collection("rooms").doc(this.roomId)
            //     .onSnapshot((qss) => {
            //         console.log(qss.data());
            //     });

            // get user id by cookie
            let str = document.cookie;
            str.split(";").forEach((val) => {
                let arr = val.split("=");
                if (arr[0].indexOf(this.roomId) != -1) {
                    this.userId = arr[1];
                }
            });

            if (this.userId) {
                firebase.firestore().doc(`rooms/${this.roomId}/users/${this.userId}`).get()
                    .then((qss) => {
                        let data = qss.data();
                        if (data) {
                            this.userName = data.name;
                            this.already = data.already;
                        }
                    })
            } else {
                firebase.firestore().collection(`rooms/${this.roomId}/users`)
                    .add({name: this.userName, already: false})
                    .then((ref: any) => {
                        this.userId = ref.id;
                        document.cookie = this.roomId + "=" + this.userId;
                    })
            }

            // logs
            firebase.firestore().doc(`rooms/${this.roomId}`)
                .onSnapshot((qss) => {
                    let data = qss.data();
                    if (data) {
                        this.logs = <string[]>data.logs || [];
                        this.mode = data.mode || 1;
                        this.firstUserId = data.firstUserId || "";
                    }
                });
        }

        private changeMode() {
            this.pushLog(`Modeを${this.modeList[this.mode].label}に変更`);
        }

        private pushLog(msg: string) {
            this.logs.unshift(`${this.userName}が${msg}`);
            if (this.logs.length > 20) {
                this.logs.pop();
            }
            firebase.firestore().doc(`rooms/${this.roomId}`).update({
                logs: this.logs,
                mode: this.mode
            });
        }

    }
</script>

<style lang="scss">
  @import "style/_utils/index";
  @import "style/reboot-custom";

  .main-btn {
    border: 0;
    background-color: red;
    width: 5rem;
    height: 5rem;
  }
</style>
