<template>
  <v-card max-width="40rem" class="mx-auto">
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col>
          Pod {{pod_id}}
        </v-col>
        <v-spacer />
        <v-col cols=auto>
          <v-btn icon @click="delete_pod()" color="#c00000">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-card-text v-if="pod">
      <v-row>
        <v-col>
          port: {{pod.service.spec.ports[0].nodePort}}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          Status: {{pod.pod.status.phase}}
        </v-col>
      </v-row>
    </v-card-text>
    
  </v-card>
</template>

<script>

  export default {
    name: 'PodView',
    data(){
      return {
        pod: null,
      }
    },
    mounted(){
      this.get_pod()
    },
    methods: {
      async get_pod() {
        try {
          const route = `/pods/${this.pod_id}`
          const { data } = await this.axios.get(route)
          this.pod = data
        } catch (error) {
          console.error(error)
        }
      },
      async delete_pod() {
        if(!confirm('Delete this environment?')) return
        try {
          const route = `/pods/${this.pod_id}`
          await this.axios.delete(route)
          this.$router.push({name: 'home'})

        } catch (error) {
          console.error(error)
        }
      },

    },
    computed: {
      pod_id(){
        return this.$route.params._id
      }
    }

  }
</script>
