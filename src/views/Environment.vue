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
    <v-divider></v-divider>

    <v-card-text v-if="environment">
    
      <v-row align="baseline">
        <v-col v-if="containerImage.includes('code-server')">
          URL: <a :href="environmentUrl" target="_blank">{{environmentUrl}}</a>
        </v-col>
        <v-col v-else>
          port: {{environment.service.spec.ports[0].nodePort}}
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          Status:
        </v-col>
        <v-col cols="auto">
          <v-chip :color="chipColor">
            {{ environmentReady ? 'Ready' : 'Not ready' }}
          </v-chip>
        </v-col>
      </v-row>
      
    </v-card-text>

    <v-expansion-panels flat v-if="environment">
      <v-expansion-panel>
        <v-expansion-panel-header>
          Details
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle>Deployment name</v-list-item-subtitle>
              <v-list-item-title>{{environment.deployment.metadata.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
    
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle>Container image</v-list-item-subtitle>
              <v-list-item-title>{{environment.deployment.spec.template.spec.containers[0].image}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
    
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle>User</v-list-item-subtitle>
              <v-list-item-title>{{environment.deployment.metadata.labels.user_id}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>
    
    </v-expansion-panels>



   


    
    
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
          const route = `/environments/${this.environment_name}`
          const { data } = await this.axios.get(route)
          this.environment = data

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
          const route = `/environments/${this.environment_name}`
          await this.axios.delete(route)
          this.$router.push({name: 'environments'})

        } catch (error) {
          console.error(error)
        }
      },

    },
    computed: {
      environment_name(){
        return this.$route.params.name
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
