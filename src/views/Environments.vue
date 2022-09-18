<template>
  <v-card class="mx-auto" max-width="50rem">
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col>Available CDEs</v-col>
        <v-spacer />
        <v-col cols=auto>
          <CreateEnvironmentDialog />
        </v-col>
      </v-row>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items">
        <template v-slot:[`item._id`]="{ item }">
          <router-link :to="{name: 'environment', params: {_id: item._id}}">
            {{item._id}}
          </router-link>
        </template>
        
      </v-data-table>
    </v-card-text>
    
  </v-card>
</template>

<script>
import CreateEnvironmentDialog from '@/components/CreateEnvironmentDialog.vue'
export default {
  name: 'Environments',
  components: {
    CreateEnvironmentDialog
  },
  data(){
    return {
      headers: [
        { text: 'ID', value: '_id'}
      ],
      items: []
    }
  },
  mounted(){
    this.get_environments()
  },
  methods: {
    async get_environments() {
      try {
        const route = '/environments'
        const { data } = await this.axios.get(route)
        this.items = data

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
