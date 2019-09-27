<template>
  <div class="container">
    <textarea
      class="text"
      v-model="source"
    >
    </textarea>
    <flaph
      class="graph"
      v-model="source"
    >
    </flaph>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: row;
    flex: 1;
    padding: 20px;
  }

  .text {
    width: 600px;
    padding: 8px;
    font-family: monaco, monospace;
    font-size: 16px;
  }

  .graph {
    margin-left: 20px;
    flex: 1;
  }
</style>

<script lang="ts">
  import Flaph from 'flaph-vue';

  const defaultSource = `1: {
  body: Node1
  to: 2
}
2: {
  body: Node2
}
3: {
  body: Node3Node3Node3Node3
  to: 2
}
4: {
  body: Node4
  to: 3
}
5: {
  body: Node5
  width: 200
}
6: {
  body: Node6
  to:4
  width: 50
  height: 200
}
`;

  export default {
    data: function() {
      return {
        source: defaultSource
      }
    },
    components: {
      Flaph
    }
  };
</script>