# How to Mark Cars as Sold / Manage Inventory Status

## cars.json da status o'zgartirish

Har bir mashina uchun `"status"` field mavjud. Faqat shu fieldni o'zgartiring:

### Car ni SOLD qilish:
```json
{
  "id": 5,
  "make": "Toyota",
  "model": "Camry",
  "status": "sold"    ← Bu yerda "available" ni "sold" ga o'zgartiring
}
```

### Car ni yana AVAILABLE qilish:
```json
{
  "status": "available"
}
```

## Inventory sahifasidagi natija:
- **Available** tab: Faqat mavjud mashinalar ko'rinadi
- **Sold** tab: Faqat "sold" mashinalar ko'rinadi (ustida SOLD yozuvi bilan)
- **All Vehicles** tab: Barcha mashinalar ko'rinadi

## Car detail sahifasida:
- Sold mashina sahifasi ochilsa — "This vehicle has been sold" banneri chiqadi
- Test Drive / Call Now tugmalari o'chadi
- "Browse Available Cars" link ko'rinadi

## Maslahat: Sold mashina ni o'chirish yoki qoldirish?
- **Qoldirish (recommended)**: `"status": "sold"` — Bu SEO uchun yaxshi, 
  va xaridorlar o'xshash mashinalarni izlaydi
- **O'chirish**: cars.json dan butun entry ni o'chiring — 
  lekin bu URL 404 xatolikka olib keladi
