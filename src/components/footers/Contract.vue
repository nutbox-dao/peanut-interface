<template>
  <div id="content">
    <h1>{{ $t('message.contractAddr') }}</h1>

    <div class="text">
   <p><strong>NutboxSteem</strong> <br>
       {{this.tsteem}}
    </p>

      <p><strong>NutboxSbd</strong> <br>
          {{this.tsbd}}
      </p>


      <p><strong>NutboxPnut</strong> <br>
        {{this.pnut}}
      </p>

      <p><strong>PnutPool</strong> <br>
        {{ this.peanutsPool }}
      </p>

      <p><strong>NutboxTsp</strong><br>
        {{this.tsp}}
      </p>

      <p><strong>TspPool</strong><br>
        {{this.tspPool}}
      </p>

      <p><strong>TspLPPool</strong><br>
        {{this.tspLPPool}}
      </p>

      <p><strong>{{$t('message.attention')}}</strong> <br>
      {{$t('message.attensionInfo')}}
      </p>

      <p><strong>Tronscan：</strong> <br>

        <a target="_blank" href="https://shasta.tronscan.org/#/contract/TDJjuVeGBtxWQPKFPuHsyD5p51scqYwiXf/code">https://shasta.tronscan.org</a>

      </p>



    </div>


  </div>
</template>

<script>
  import {peanutsPoolAddress,tsbdAddress,tsteemAddress,peanutAddress,tspAddress,tspPoolAddress,tspLPPoolAddress} from '../../utils/contractAddress.js'
  export default {
    name: "Contract",
    data() {
      return {
        peanutsPool : '',
        tsbd:'',
        tsteem:'',
        pnut:'',
        tsp:'',
        tspPool:'',
        tspLPPool:''
      }
    },
    mounted() {
      let that = this
      async function main(){
        that.peanutsPool = await peanutsPoolAddress()
        that.tsbd = await tsbdAddress()
        that.tsteem = await tsteemAddress()
        that.pnut = await peanutAddress()
        that.tsp = await tspAddress()
        that.tspPool = await tspPoolAddress()
        that.tspLPPool = await tspLPPoolAddress()
      }
      main()
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

