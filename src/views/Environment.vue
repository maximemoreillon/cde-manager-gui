<template>
  <v-card max-width="30rem" class="mx-auto">
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
          ID: {{environment._id}}
        </v-col>
      </v-row>
      <v-row align="baseline">
        <v-col>
          port: {{environment.service.spec.ports[0].nodePort}}
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto">
          Status: 
        </v-col>
        <v-col>
          <v-chip :color="chipColor">
            {{environment.pod.status.phase}}
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
      }
    },
    mounted(){
      this.get_environment()
    },
    methods: {
      async get_environment() {
        try {
          const route = `/environments/${this.environment_id}`
          const { data } = await this.axios.get(route)
          this.environment = data
        } catch (error) {
          console.error(error)
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
      chipColor(){
        const {phase} = this.environment.pod.status
        if (phase === 'Pending') return 'orange'
        else if (phase === 'Running') return 'green'
        else return ''
      }
    }

  }
</script>