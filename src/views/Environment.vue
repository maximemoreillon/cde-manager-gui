<template>
  <v-card max-width="30rem" class="mx-auto" :loading="loading">
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-btn icon :to="{name: 'environments'}" exact>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          CDE
        </v-col>
        <v-spacer />
        <v-col cols=auto>
          <v-btn icon @click="delete_environment()" color="#c00000">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-card-text v-if="environment">
      <v-row align="baseline">
        <v-col>
          Name: {{environment.deployment.metadata.name}}
        </v-col>
      </v-row>
      <v-row align="baseline">

      </v-row>
      <v-row align="baseline">
        <v-col>
          User: {{environment.deployment.metadata.labels.user_id}}
        </v-col>
      </v-row>
      
      <v-row align="baseline" >
        <v-col v-if="containerImage.includes('code-server')">
          <a :href="environmentUrl" target="_blank">{{environmentUrl}}</a>
        </v-col>
        <v-col v-else>
          port: {{environment.service.spec.ports[0].nodePort}}
        </v-col>
      </v-row>
      <v-row align="baseline">
        <v-col cols="auto">
          Status: 
        </v-col>
        <v-col>
          <v-chip :color="chipColor">
            {{ environmentReady ? 'Ready' : 'Not ready' }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
    
  </v-card>
</template>

<script>

  export default {
    name: 'environmentView',
    data(){
      return {
        environment: null,
        loading: false,
      }
    },
    mounted(){
      this.get_environment()
    },
    methods: {
      async get_environment() {
        this.loading = true

        try {
          const route = `/environments/${this.environment_id}`
          const { data } = await this.axios.get(route)
          this.environment = data

          console.log(data)

          if (!this.environmentReady) setTimeout(this.get_environment, 3000)

        }
        catch (error) {
          console.error(error)
        }
        finally {
          this.loading = false
        }
      },
      async delete_environment() {
        if(!confirm('Delete this environment?')) return
        try {
          const route = `/environments/${this.environment_id}`
          await this.axios.delete(route)
          this.$router.push({name: 'environments'})

        } catch (error) {
          console.error(error)
        }
      },

    },
    computed: {
      environment_id(){
        return this.$route.params._id
      },
      environmentReady(){
        const { readyReplicas, replicas } = this.environment.deployment.status
        return readyReplicas === replicas
      },
      chipColor(){
        if (this.environmentReady) return 'green'
        else return 'red'
      },
      podNodeport(){
        return this.environment.service.spec.ports[0].nodePort
      },
      environmentUrl(){

        const apiUrl = new URL(process.env.VUE_APP_CDE_MANAGER_API_URL)

        const {
          protocol,
          hostname
        } = apiUrl

        return `${protocol}//${hostname}:${this.podNodeport}`
      },
      containerImage(){
        return this.environment.deployment.spec.template.spec.containers[0].image
      }
    }

  }
</script>
