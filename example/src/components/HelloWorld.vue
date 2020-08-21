<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script>
import init, { greet } from 'rust_crate';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {
    init();
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>
