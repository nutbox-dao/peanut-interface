<template>
  <div id="content">
    <h1>常用工具</h1>

    <div class="text">
   <p><strong>steem-keychain</strong> <br>
       https://chrome.google.com/webstore/detail/steem-keychain/lkcjlnjfpbikmcmbachjpdbijejflpcm
    </p>

      <p><strong>TronLink</strong> <br>
          https://www.tronlink.org
      </p>


    </div>


  </div>
</template>

<script>

  export default {
    name: "Tools",
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

