<template>
  <div id="content">
    <h1>{{ $t("message.contact") }}</h1>

    <div class="text">
   <p><strong>Discord</strong> <br>
       https://discord.gg/Fsn5XC
    </p>

    <p><strong>Medium</strong> <br>
      https://medium.com/@nutbox
    </p>

    <p><strong>twitter</strong> <br>
        @nutbox_dao
    </p>

    </div>


  </div>
</template>

<script>

  export default {
    name: "Contact",
    data() {
      return {

      }
    },


  }
</script>

<style scoped>
  h1{
    font-size: 2rem;
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ddd;
  }
  #content{
    color: rgba(55,53,58,0.75);
    align: center;
    margin: 1rem auto;
    width: 60%;
    padding-bottom: 0.2rem;
  }
  .text{
    line-height: 1.8rem;
  }

  a{
    color: rgba(55,53,58,0.75);
  }

  a:hover{
    color: darkcyan;
    text-decoration: none;
  }

  .btn-outline-primary {
    color: rgba(55,53,58,0.75);
    border-color: rgba(55,53,58,0.75);
  }
  .btn-outline-primary:hover{
    background-color: chocolate;
  }
</style>

