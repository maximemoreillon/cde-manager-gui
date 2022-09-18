<template>
    <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                Create
            </v-btn>
        </template>
    
        <v-card>
            <v-card-title>
                Create environment
            </v-card-title>
    
            <v-form @submit.prevent="create_environment()">
            <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field
                                label="Username"
                                v-model="environmentSettings.username"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field label="Password" type="password" v-model="environmentSettings.password"></v-text-field>
                        </v-col>
                    </v-row>
 
                </v-card-text>
                
                
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" type="submit" text>
                        Create
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'CreateEnvironmentDialog',
    data(){
        return {
            dialog: false,
            environmentSettings: {
                username: '',
                password: '',
            }

        }
    },
    methods: {
        async create_environment() {
            try {
                const route = '/environments'
                const { data: { _id } } = await this.axios.post(route, this.environmentSettings)
                this.$router.push({ name: 'environment', params: { _id } })

            } catch (error) {
                console.error(error)

            }
        },

    }
}
</script>
