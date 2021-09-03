import UpdateEmail from './UpdateEmail.vue'

export default {
  title: 'views/routes/user/UpdateEmail',
  component: UpdateEmail,
}

export const onSuccessStory = () => ({
  components: { UpdateEmail },
  template: '<UpdateEmail />',
  $route: {
    query: {
      token: 'abc',
    },
  },
  data () {
    return {
      loading: true,
    }
  },
  mounted () {
    //
  },
})
onSuccessStory.storyName = 'on success'
