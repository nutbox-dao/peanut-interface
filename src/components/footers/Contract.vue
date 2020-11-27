<template>
  <div id="content">
    <h1>合约地址</h1>

    <div class="text">
   <p><strong>NutboxSteem</strong> <br>
       TBUZYrDh7gzjd1PLnkMHWoAo55ctRzZzGN
    </p>

      <p><strong>NutboxSbd</strong> <br>
          TEPZJmYLJxJc8b5FueswwLWmUDhJGnih6Q
      </p>


      <p><strong>NutboxPnut</strong> <br>
        TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW
      </p>

      <p><strong>PnutPool</strong> <br>
        TB8naH6r4bJyDvmZotgaGDRbbd2Mw4Jg5E
      </p>

      <p><strong>注意：</strong> <br>
        假币骗局！请不要以代币的名字查询和交易代币，应以代币的合约地址为准！
      </p>

      <p><strong>Tronscan查询：</strong> <br>

        <a target="_blank" href="https://tronscan.org/#/contract/TB8naH6r4bJyDvmZotgaGDRbbd2Mw4Jg5E/transactions">https://tronscan.org/#/contract/TB8naH6r4bJyDvmZotgaGDRbbd2Mw4Jg5E/transactions</a>
      </p>



    </div>


  </div>
</template>

<script>

  export default {
    name: "Contract",
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

