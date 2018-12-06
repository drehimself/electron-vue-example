<template>
  <div class="hello">
    <ul class="list-group list-group-flush">
      <li class="list-group-item flex-container" v-for="post in posts" :key="post.data.id" @click="openImage(post.data.preview.images[0].source.url)">
        <img :src="post.data.thumbnail" alt="thumb" class="thumbnail">
        <div>{{ post.data.title }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
const axios = require("axios");
const { remote, ipcRenderer } = require("electron")
const { Menu } = remote

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      posts: []
    }
  },
  created() {
    this.initMenu();

    axios.get("https://reddit.com/r/aww.json?raw_json=1")
      .then(response => {
        this.posts = response.data.data.children
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    initMenu() {
      const menu = Menu.buildFromTemplate([
        {
          label: "File",
          submenu: [
            { label: "New Window" },
            {
              label: "Settings",
              accelerator: "CmdOrCtrl+,",
              click: () => {
                ipcRenderer.send("toggle-settings");
              }
            },
            { type: "separator" },
            {
              label: "Quit",
              accelerator: "CmdOrCtrl+Q"
            }
          ]
        },
        {
          label: "Edit",
          submenu: [
            { label: "Menu Item 1" },
            { label: "Menu Item 2" },
            { label: "Menu Item 3" }
          ]
        }
      ]);
      Menu.setApplicationMenu(menu);
    },
    openImage(image) {
      ipcRenderer.send("toggle-image", image)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.list-group {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.list-group-flush .list-group-item {
  border-right: 0;
  border-left: 0;
  border-radius: 0;
}

.list-group-flush:first-child .list-group-item:first-child {
  border-top: 0;
}

.flex-container {
  display: flex;
  align-items: center;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 16px;
}

.list-group-item {
  cursor: pointer
}

.list-group-item:hover {
  background-color: #eee;
}

</style>
