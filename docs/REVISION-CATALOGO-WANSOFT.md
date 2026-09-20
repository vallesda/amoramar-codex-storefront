# Revisión inicial del catálogo Amor a Mar

19 de septiembre de 2026. Comparación de lectura; no se han creado ni modificado productos, imágenes, precios o existencias.

## Alcance y resultados

Fuente: `productos_amoramar_2026_inicial.numbers`, hoja Productos, tabla Table 1, filas 2–95. La fila 96 está vacía. Hoja Catalogo revisada como documentación del archivo, no como instrucciones de ejecución.

- 94 registros con ID, SKU generado, nombre, precio, presentación, categoría y clave. Claves y SKU sin duplicados dentro del archivo.
- Shopify Storefront: 48 productos publicados y 60 variantes consultadas, sin paginación pendiente. Este acceso no incluye todo el catálogo administrativo.
- Los SKU AAM-… fueron generados para el archivo según su hoja Catalogo. La columna Clave conserva el código del sistema origen; no son identificadores intercambiables.
- La columna «Cantiad» representa presentación/peso/volumen, no stock. No hay columna de existencias ni sucursal. No se puede cargar inventario físico a partir de esta tabla.
- La moneda no está declarada en Numbers. Shopify responde MXN; confirmar la moneda y vigencia de Precio1 antes de altas.

| Resultado preliminar | Registros |
|---|---:|
| Sin candidato público | 60 |
| Posible existente | 30 |
| Clave coincidente: revisar | 3 |
| Conflicto de clave | 1 |

**Sin candidato público no significa producto faltante confirmado.** Las posibles coincidencias son propuestas de revisión, no equivalencias aceptadas. No se ha tratado una similitud de nombre como autorización para fusionar productos.

## Hallazgos que afectan las altas

- **AMC031:** el archivo lo asigna a Fresh Filete Salmon Kg; Shopify lo usa en Filete Rock Cod Silvestre 180gr. La variante de salmón publicada usa AMC031-1. No eliminar sufijos para forzar coincidencias.
- **AMC035:** langosta por 1 kg en el archivo frente a 500–600 g publicada. Una clave igual no garantiza una presentación igual.
- Hamburguesas de atún y salmón: 150 g en origen frente a 300 g publicadas. No son equivalencias automáticas.
- Filete de Totoaba tiene «Amor a Mar Club» como clave. Grado Sashimi tiene precio cero. Ostiones Abiertos podría ser un servicio. Requieren aclaración de datos.
- Hay nombres repetidos con presentaciones distintas, como Caldo de Hueso, Callo Media Luna y Ostion Amor a Mar; deben conservarse como registros distintos durante el cruce.
- La hoja Catalogo reporta 27 Complementos, pero la tabla actual contiene 25. Los ID prod_0020 y prod_0094 no están presentes. No reconstruir ni importar filas ausentes.
- La columna Imagenes no contiene valores de texto. El archivo incluye un recurso gráfico llamado fresco_filete_cabicucho; no se ha asumido que todas las filas tengan fotografía ni que ese recurso corresponda a otra especie.
- Las categorías de frescura del archivo provienen de reglas de nombres según Catalogo. Conviene confirmar conservación real antes de publicar etiquetas nuevas.

## Próximo paso

Recibir la exportación completa de productos y variantes de Shopify (incluidos activos, borradores y archivados), o acceso administrativo. Repetir cruce por clave y presentación, resolver conflictos y crear únicamente faltantes con fotos nuevas. Mantener intactos todos los productos existentes. No generar en bloque imágenes para registros que podrían existir con otro SKU.

## Referencia para la suscripción

Ya están publicados CLUB AMOR A MAR 1KG, 2KG y 3KG, cada uno con opciones PESCA SILVESTRE, PESCA CULTIVO y MIXTO. Sirven para revisar la oferta histórica. Esta consulta no verificó selling plans ni contratos, por lo que no confirma suscripciones activas.

## Detalle del cruce

Precio origen es el valor del archivo, no una instrucción de actualización. Las referencias Shopify enlazan al administrador para verificar el registro.

| Fila | SKU archivo / Clave | Producto origen | Presentación | Precio origen | Resultado | Candidato Shopify | Revisión |
|---:|---|---|---|---:|---|---|---|
| 2 | AAM-0001 / AMC107 | AA Arroz Nishiki 2.26 Kg | 2.26 kg | 215.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 3 | AAM-0002 / 01109 | AA Caldo de Hueso 500 ml | 500 ml | 290.00 | Posible existente | [Bone Broth 500ml](https://admin.shopify.com/store/amoramar-mx/products/9099532632346) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 4 | AAM-0003 / 01218 | AA Caldo de Hueso 980 ml | 980 ml | 400.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 5 | AAM-0004 / 01213 | AA Ceviche de Atun 200 gr | 200 gr | 170.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 6 | AAM-0005 / 01211 | AA Ceviche de Pescado Blanco 200 gr | 200 gr | 150.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 7 | AAM-0006 / 01212 | AA Ceviche de Salmon 200 gr | 200 gr | 150.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 8 | AAM-0007 / 01201 | AA Cuello de Mar Kg | 1 kg | 400.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 9 | AAM-0008 / 01123 | AA Hamburguesa de Atún Azul PQ 150gr | 150 gr | 125.00 | Posible existente | [Hamburguesa de Atún Aleta Azul 300 gr](https://admin.shopify.com/store/amoramar-mx/products/8129317273882) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 10 | AAM-0009 / 01124 | AA Hamburguesa de Salmón PQ 150 gr | 150 gr | 90.00 | Posible existente | [Carne de Hamburguesa de Samón 300 gr](https://admin.shopify.com/store/amoramar-mx/products/8129315406106) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 11 | AAM-0010 / 01121 | AA Mejillón Ahumado 120 gr | 120 gr | 200.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 12 | AAM-0011 / 01137 | AA Paquete de Hueso 500 gr | 500 gr | 100.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 13 | AAM-0012 / 01210 | AA Shell Chowder 300 grs | 300 gr | 180.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 14 | AAM-0013 / AMC126 | AA Tuna Jerky 90 gr | 90 gr | 300.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 15 | AAM-0014 / AMC008 | Almeja Chione kg | 1 kg | 145.00 | Clave coincidente: revisar | [Almejita Chione 1kg](https://admin.shopify.com/store/amoramar-mx/products/8128580256026) | Misma clave AMC008 y 1 kg; precio Numbers 145, Shopify 130. Conservar precio existente. |
| 16 | AAM-0015 / AMC79 | Almeja Chocolata Doc | 1 docena | 370.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 17 | AAM-0016 / AMA033 | Atun Pastrami kg | 1 kg | 2300.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 18 | AAM-0017 / AMC129 | Blanco California Filete Kg | 1 kg | 430.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 19 | AAM-0018 / 01200 | BM Aderezo Yuzu Kosho 8 Oz | 8 oz | 190.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 20 | AAM-0019 / AMC115 | BM Jengibre y Serrano 30 gr | 30 gr | 40.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 21 | AAM-0021 / 01131 | BM Mantequilla Hierbas Finas 100gr | 100 gr | 60.00 | Posible existente | [Mantequilla finas hierbas 100 gr](https://admin.shopify.com/store/amoramar-mx/products/8129335853338) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 22 | AAM-0022 / 01143 | BM Salsa 5 chiles/Crema Cacahuate 8oz | 8 oz | 90.00 | Posible existente | [Salsa 5 chiles y crema de cacahuate  230 ml](https://admin.shopify.com/store/amoramar-mx/products/8129331167514) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 23 | AAM-0023 / 01146 | BM Salsa Aguachile 500 ml | 500 ml | 150.00 | Posible existente | [Salsa Aguachile Negro 500ml](https://admin.shopify.com/store/amoramar-mx/products/8129332281626) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 24 | AAM-0024 / 01157 | BM Salsa Coctelera 500 ml | 500 ml | 150.00 | Posible existente | [Salsa Coctelera 500ml](https://admin.shopify.com/store/amoramar-mx/products/8129331855642) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 25 | AAM-0025 / 01145 | BM Salsa Mignonette 4oz | 4 oz | 45.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 26 | AAM-0026 / 01147 | BM Salsa Pepita 8oz | 8 oz | 95.00 | Posible existente | [Salsa con Pepita de calabaza 230 ml](https://admin.shopify.com/store/amoramar-mx/products/8129332904218) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 27 | AAM-0027 / 01148 | BM Salsa Pesto 4 Oz | 4 oz | 95.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 28 | AAM-0028 / 01149 | BM Salsa Rasurado 8oz | 8 oz | 95.00 | Posible existente | [Salsa Rasurado 230 ml](https://admin.shopify.com/store/amoramar-mx/products/8129333887258) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 29 | AAM-0029 / 01150 | BM Salsa Roja 8oz | 8 oz | 90.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 30 | AAM-0030 / 01151 | BM Salsa Rub Rojo 4oz | 4 oz | 90.00 | Posible existente | [Rub Rojo 4 oz](https://admin.shopify.com/store/amoramar-mx/products/8129337000218) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 31 | AAM-0031 / 01198 | BM Salsa Tartara 500 ml | 500 ml | 150.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 32 | AAM-0032 / 01153 | BM Salsas Sriracha 8oz | 8 oz | 95.00 | Posible existente | [Aderezo de Sriracha 500 ml](https://admin.shopify.com/store/amoramar-mx/products/8129328906522) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 33 | AAM-0033 / 01107 | Bolsa / Hielera Amor a Mar Pza | 1 pieza | 150.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 34 | AAM-0034 / 101105 | Cabeza de Atun AA Club Kg | 1 kg | 550.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 35 | AAM-0035 / 01108 | Cabeza de Pescado KG | 1 kg | 225.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 36 | AAM-0036 / 01194 | Cabicucho Entero AA Kg | 1 kg | 480.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 37 | AAM-0037 / 01217 | Callo Media Luna 200 gr | 200 gr | 360.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 38 | AAM-0038 / 01111 | Callo Media Luna 500 gr | 500 gr | 900.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 39 | AAM-0039 / 01112 | Camaron 26/30 Desvenado 500 gr | 500 gr | 280.00 | Posible existente | [Camarón de Altamar 26/30 limpio 500 gr](https://admin.shopify.com/store/amoramar-mx/products/8128493781274) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 40 | AAM-0040 / 01114 | Camaron con Cabeza 10/20 Kg | 1 kg | 800.00 | Posible existente | [Camarón 20-30 de Altamar con cabeza 1 Kg](https://admin.shopify.com/store/amoramar-mx/products/8128634585370) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 41 | AAM-0041 / 01117 | Camaron U-15 Desvenado 500 gr | 500 gr | 575.00 | Posible existente | [Camarón U-15 de Altamar 500 gr Limpio](https://admin.shopify.com/store/amoramar-mx/products/8128647168282) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 42 | AAM-0042 / AMC123 | Cardenal Entero Club Kg | 1 kg | 300.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 43 | AAM-0043 / 01180 | Cecy Gon/  Sazonador Casero | 1 unidad | 240.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 44 | AAM-0044 / 01176 | Cecy Gon/ Roja | 1 unidad | 185.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 45 | AAM-0045 / 01179 | Cecy Gon/ Sazonador Rancho | 1 unidad | 240.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 46 | AAM-0046 / 01178 | Cecy Gon/ Sazonador Texano | 1 unidad | 240.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 47 | AAM-0047 / 01197 | Collar de Atun Aleta Azul Kg Club | 1 kg | 900.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 48 | AAM-0048 / AMC127 | Cong Filete de Cardenal Kg | 1 kg | 600.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 49 | AAM-0049 / AMC01219 | Cong Filete de Curvina Kg | 1 kg | 390.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 50 | AAM-0050 / AMC121 | Cong Filete de Jurel Kg | 1 kg | 750.00 | Posible existente | [Filete Jurel Yellow Tail Silvestre 180gr](https://admin.shopify.com/store/amoramar-mx/products/8129251639578) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 51 | AAM-0051 / AMC120 | Cong Filete de Leguado Kg | 1 kg | 650.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 52 | AAM-0052 / AMC118 | Cong Filete de Pargo Kg | 1 kg | 900.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 53 | AAM-0053 / AMC119 | Cong Filete de Salmon Kg | 1 kg | 800.00 | Posible existente | [Filete de Salmón Canadiense 180gr](https://admin.shopify.com/store/amoramar-mx/products/8128543293722) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 54 | AAM-0054 / AMC125 | Entero Baqueta Kg | 1 kg | 410.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 55 | AAM-0055 / 01192 | Entero Huachinango KG | 1 kg | 480.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 56 | AAM-0056 / 01126 | Entero Jurel Silvestre kg | 1 kg | 380.00 | Posible existente | [Jurel Yellow Tail Silvestre Entero  entre 5-6kg](https://admin.shopify.com/store/amoramar-mx/products/8129247117594) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 57 | AAM-0057 / 01128 | Entero Lenguado Kg | 1 kg | 430.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 58 | AAM-0058 / 01222 | Entero Lomo Prieto Kg | 1 kg | 300.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 59 | AAM-0059 / 01185 | Entero Mero Kg | 1 kg | 430.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 60 | AAM-0060 / 01159 | Entero Pargo Kg | 1 kg | 450.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 61 | AAM-0061 / 01140 | Entero Rockot 1-2 Kg | 1 kg | 400.00 | Posible existente | [ROCK FISH ENTERO 1.5KG](https://admin.shopify.com/store/amoramar-mx/products/8719295217946) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 62 | AAM-0062 / 01142 | Entero Salmon Kg | 1 kg | 520.00 | Posible existente | [Salmon Canadience Entero](https://admin.shopify.com/store/amoramar-mx/products/8128540737818) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 63 | AAM-0063 / Amor a Mar Club | FILETE DE TOTOABA | 1 kg | 1000.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. Clave atípica: «Amor a Mar Club»; confirmar código real. |
| 64 | AAM-0064 / AMA087 | Frasco Ostion Ahumado | 1 frasco | 250.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 65 | AAM-0065 / AMC009 | Fresh Filete Aleta Azul Kg | 1 kg | 1500.00 | Posible existente | [Filete Atún Aleta Azul 180gr](https://admin.shopify.com/store/amoramar-mx/products/8128443646234) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 66 | AAM-0066 / AMC124 | Fresh Filete Baqueta Kg | 1 kg | 950.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 67 | AAM-0067 / AMC128 | Fresh Filete Baqueta Roja Kg | 1 kg | 900.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 68 | AAM-0068 / 01203 | Fresh Filete Cabicucho Kg | 1 kg | 1050.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 69 | AAM-0069 / 01170 | Fresh Filete Chutoro Kg | 1 kg | 1850.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 70 | AAM-0070 / 01193 | Fresh Filete Huachinango kg | 1 kg | 1050.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 71 | AAM-0071 / AMC068 | Fresh Filete Lenguado Kg | 1 kg | 650.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 72 | AAM-0072 / 01221 | Fresh Filete Lomo Prieto KG | 1 kg | 730.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 73 | AAM-0073 / AMA008 | Fresh Filete Mero kg | 1 kg | 850.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 74 | AAM-0074 / AMC002 | Fresh Filete O toro kg | 1 kg | 2200.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 75 | AAM-0075 / 01202 | Fresh Filete Pargo Kg | 1 kg | 900.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 76 | AAM-0076 / AMC091 | Fresh Filete Rockot Kg | 1 kg | 850.00 | Posible existente | [Filete Rock Cod Silvestre  180gr](https://admin.shopify.com/store/amoramar-mx/products/8129274446106) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 77 | AAM-0077 / AMC031 | Fresh Filete Salmon Kg | 1 kg | 800.00 | Conflicto de clave | [Filete Rock Cod Silvestre  180gr](https://admin.shopify.com/store/amoramar-mx/products/8129274446106) | AMC031: Salmón en Numbers, Rock Cod en Shopify. No vincular ni crear automáticamente. |
| 78 | AAM-0078 / 01102 | Fresh Filete Yellowtail Kg | 1 kg | 750.00 | Posible existente | [Filete Jurel Yellow Tail Silvestre 180gr](https://admin.shopify.com/store/amoramar-mx/products/8129251639578) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 79 | AAM-0079 / AMC097 | Grado Sashimi | 1 unidad | 0.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. Precio 0: confirmar si es atributo/servicio en lugar de producto vendible. |
| 80 | AAM-0080 / 01125 | IKURA Salmon Roe 45 GR | 45 gr | 225.00 | Posible existente | [Ikura Salmon Roe 45gr](https://admin.shopify.com/store/amoramar-mx/products/8129242890522) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 81 | AAM-0081 / AMA-410 | Jurel  Entero Kg AA | 1 kg | 270.00 | Posible existente | [Jurel Yellow Tail Silvestre Entero  entre 5-6kg](https://admin.shopify.com/store/amoramar-mx/products/8129247117594) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 82 | AAM-0082 / AMC035 | Langosta Roja California Kg | 1 kg | 1150.00 | Clave coincidente: revisar | [Langosta roja de California 500gr - 600gr](https://admin.shopify.com/store/amoramar-mx/products/8129342669082) | Misma clave AMC035, pero Numbers indica 1 kg y Shopify 500–600 g. Revisar presentación. |
| 83 | AAM-0083 / AMC096 | Lomo de Atun Aleta Azul Club Kg | 1 kg | 1250.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 84 | AAM-0084 / 01215 | Mamá de Rocco Ajo negro 170 gr | 170 gr | 289.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 85 | AAM-0085 / 01214 | Mamá de Rocco Mielixir | 1 unidad | 259.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 86 | AAM-0086 / 01132 | Medallon Atún Aleta Amarilla KG | 1 kg | 450.00 | Posible existente | [Medallon de Atún Aleta Amarilla 200 gr](https://admin.shopify.com/store/amoramar-mx/products/8128532349210) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 87 | AAM-0087 / AMC003 | Mejillon kg | 1 kg | 230.00 | Posible existente | [Mejillon Mediterraneo 1kg](https://admin.shopify.com/store/amoramar-mx/products/8129216610586) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 88 | AAM-0088 / 01134 | Ostion Amor a Mar Docena | 1 docena | 230.00 | Posible existente | [Ostion Amor a Mar Docena](https://admin.shopify.com/store/amoramar-mx/products/8128535036186) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 89 | AAM-0089 / 01135 | Ostion Amor a Mar Pieza | 1 pieza | 20.00 | Posible existente | [Ostion Amor a Mar Docena](https://admin.shopify.com/store/amoramar-mx/products/8128535036186) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 90 | AAM-0090 / 01136 | Ostion Chingon Docena | 1 docena | 430.00 | Posible existente | [Ostión Reserva docena](https://admin.shopify.com/store/amoramar-mx/products/8129287749914) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 91 | AAM-0091 / AMC104 | Ostiones Abiertos | 1 unidad | 12.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. Confirmar si es servicio de apertura de ostiones. |
| 92 | AAM-0092 / 01139 | Pulpo 2-4 Cocido Kg | 1 kg | 990.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
| 93 | AAM-0093 / AMC101 | Sashimi Amor a Mar 200 gr | 200 gr | 270.00 | Posible existente | [Sashimi Mixto](https://admin.shopify.com/store/amoramar-mx/products/9752039981338) | Revisar nombre, especie, presentación y estado fresco/congelado; código distinto o ausente. |
| 94 | AAM-0095 / AMC054 | Tenaza Cangrejo Jumbo Kg | 1 kg | 900.00 | Clave coincidente: revisar | [Tenaza de cangrejo Moro Jumbo](https://admin.shopify.com/store/amoramar-mx/products/8129291551002) | Misma clave AMC054 y precio 900; Shopify no explicita peso en título. Confirmar 1 kg. |
| 95 | AAM-0096 / 01154 | Tostada Horneada Paq. | 1 paq | 55.00 | Sin candidato público | — | Consultar activos, borradores y archivados en Admin antes de declararlo faltante. |
