<template>
  <div class="w-full max-w-xs">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          {{ $t('components.login.email') }}
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email"
          type="text"
          :placeholder="$t('components.login.email')"
        >
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          {{ $t('components.login.password') }}
        </label>
        <input
          class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
        >
        <p class="text-red-500 text-xs italic">
          {{ $t('components.login.passwordHelper') }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          {{ $t('components.login.signin') }}
        </button>
        <!-- <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
          Forgot Password?
        </a> -->
      </div>
    </form>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
