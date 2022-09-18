<template>
  <v-card class="mx-auto" max-width="50rem">
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col>Available CDEs</v-col>
        <v-spacer />
        <v-col cols=auto>
          <v-btn @click="create_pod()">
            <v-icon left>mdi-plus</v-icon>
            <span>Create</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items">
        <template v-slot:[`item._id`]="{ item }">
          <router-link :to="{name: 'pod', params: {_id: item._id}}">
            {{item._id}}
          </router-link>
        </template>
        
      </v-data-table>
    </v-card-text>
    
  </v-card>
</template>

<script>

  export default {
    name: 'HomeView',
    data(){
      return {
        headers: [
          { text: 'ID', value: '_id'}
        ],
        items: []
      }
    },
    mounted(){
      this.get_pods()
    },
    methods: {
      async get_pods() {
        try {
          const route = '/pods'
          const { data } = await this.axios.get(route)
          this.items = data

        } catch (error) {
          console.error(error)
        }
      },
      async create_pod(){
        try {
          const route = '/pods'
          const { data: {_id} } = await this.axios.post(route)
          this.$router.push({name: 'pod', params: {_id}})

        } catch (error) {
          console.error(error)

        }
      },
      item_clicked(event){
        console.log(event)
      }
    }

  }
</script>
