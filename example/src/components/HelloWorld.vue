<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script>
import init from 'rust_crate';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {
    init().then(m => {
      m.greet();
    });
    // The following async loading also works
    // import('rust_crate').then(async (m) => {
    //   await m.default();
    //   m.greet();
    // });
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>
