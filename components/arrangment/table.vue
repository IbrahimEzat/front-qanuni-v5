<template>
  <div class="overflow-auto">
    <v-container>
      <v-table height="600" class="overflow-auto" hover density="comfortable">
        <thead>
          <tr>
            <th>#</th>
            <th class="font-weight-bold">الاسم</th>
            <th class="font-weight-bold">تاريخ التسجيل</th>
            <th class="font-weight-bold">الصفة</th>
            <th class="font-weight-bold">النقاط</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in admins" :key="item.id">
            <td>
              <v-avatar
                color="#f1f1f1"
                class="text-black font-weight-medium"
                size="25"
                >{{ index + 1 }}</v-avatar
              >
            </td>
            <td class="font-weight-bold"><v-avatar size="25" class="me-1" :image="item.image"></v-avatar> {{ item.name }}</td>
            <td class="font-weight-bold">
              {{ new Date(item.created_at).toLocaleDateString() }}
            </td>
            <td class="text-brown font-weight-bold">
              {{ item.type === "admin" ? "المدير" : "مستخدم" }}
            </td>

            <td class="text-red font-weight-bold">{{ item.points }}</td>
          </tr>
          <tr v-for="(item, index) in users" :key="item.id">
            <td>
              <v-avatar
                color="#f1f1f1"
                class="text-black font-weight-medium"
                size="25"
                >{{ index + admins.length + 1 }}</v-avatar
              >
            </td>
            <td class="font-weight-bold"><v-avatar size="25"  class="me-1" :image="item.image"></v-avatar> {{ item.name }}</td>
            <td class="font-weight-bold">
              {{ new Date(item.created_at).toLocaleDateString() }}
            </td>
            <td class="text-brown font-weight-bold">
              {{ item.type === "admin" ? "المدير" : "مستخدم" }}
            </td>

            <td class="text-red font-weight-bold">{{ item.points }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface user {
  name: string;
  image: string;
  id: number;
  points: number;
  type: string;
  created_at: string;
}
defineProps<{
  users: user[];
  admins: user[];
}>();
</script>

<style >
table {
  border: 1px solid #999;
  border-radius: 5px;
}

/* width */
::-webkit-scrollbar {
  width: 6px;
  border-radius: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: black;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: orange;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>