<template>
  <div class="tsp">
     <div>
       <div class="changebox">
          <p :class="[tspFlag ? 'titleSelected' : 'titleUnSelected']" @click="tspFlag = true;LPFlag=false">{{ $t('tsp.tspMine') }}</p>
          <p :class="[LPFlag ? 'titleSelected' : 'titleUnSelected']" @click="tspFlag = false;LPFlag=true">{{ $t('tsp.tspLPMine') }}</p>
        </div>
        
        <TSPMine v-show="tspFlag">
        </TSPMine>

        <TSPLPMine v-show="LPFlag">
        </TSPLPMine>

    </div>
  </div>
</template>

<script>
import TSPMine from './TSPMine.vue'
import TSPLPMine from './TSPLPMine.vue'
  
  export default {
    name: "TSP",
    data() {
      return {
        LPFlag:false,
        tspFlag:true,
        
      }
    },
    components: {
      TSPMine,
      TSPLPMine
      },
    methods: {

    }
  }
</script>

<style scoped>

  .tsp{
    width: 45%;
    max-width: 520px;
    min-width: 400px;
    margin: 2.5rem auto;
    padding: 1.5rem 1rem 2rem 1rem;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 30px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 3px 16px 24px, rgba(0, 0, 0, 0.01) 3px 24px 32px;
    border-radius: 30px;
    display: block;
    z-index: 1;
    box-sizing: border-box;
    margin-bottom: 2rem;
  }

.changebox{
  display: flex;
  justify-content: space-evenly;
  padding: 1em;
  padding-bottom: 0;

}

.changebox p{
  font-weight: 400;
  color: darkgray;
  font-size: 20px;
  cursor: pointer;
}

.titleSelected{
     color: rgb(30, 30, 30) !important;
     font-weight: 500;
     font-size: 1.2rem;
     cursor: pointer;
     text-align: center;
 }


.changebox p:hover{
  color: rgb(92, 91, 91) !important;
}

  .user{
    margin-top: 1rem;
    width: 30rem;
  }



</style>

