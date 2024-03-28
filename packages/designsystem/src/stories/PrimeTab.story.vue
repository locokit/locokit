<template>
  <Story title="PrimeTab" icon="bi:clipboard-check-fill">
    <Variant title="default">
      <PrimeTabView>
        <PrimeTabPanel header="Header I">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </PrimeTabPanel>
        <PrimeTabPanel header="Header II">
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
            velit, sed quia non numquam eius modi.
          </p>
        </PrimeTabPanel>
      </PrimeTabView>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PrimeTabView from 'primevue/tabview'
import PrimeTabPanel from 'primevue/tabpanel'
</script>

<docs lang="md">
### PrimeTab

Override prime style
</docs>
