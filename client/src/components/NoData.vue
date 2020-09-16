<template>
    <div class="no-data">
        <div>
            <img width="560" height="300" src="@/assets/email.jpg" alt="#">
        </div>
    </div>
</template>
<script>
export default {
  name: 'NoData',
};
</script>
<style lang="scss" scoped>
.no-data {
    position: relative;
    width: 100%;
    height: 100%;
    div {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }
}
</style>
