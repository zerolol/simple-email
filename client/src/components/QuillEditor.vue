<template>
    <div class="quill-editor-wrapper">
         <quill-editor
          ref="myTextEditor"
          v-model="content"
          :options="editorOption"
          @change="onEditorChange($event)"
         >
         </quill-editor>
    </div>
</template>
<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'QuillEditor',
  data() {
    return {
      content: '',
      editorOption: {
        placeholder: '编辑邮件内容',
      },
    };
  },
  components: {
    quillEditor,
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      this.$emit('content', this.content);
    },
  },
};
</script>
<style lang="scss" scoped>
.quill-editor-wrapper {
  .quill-editor {
    min-height: 450px;
  }
 /deep/ .ql-container {
   min-height: 384px;
 }
}
</style>
