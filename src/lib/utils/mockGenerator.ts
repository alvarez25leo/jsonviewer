import { faker } from "@faker-js/faker"

export interface MockOptions {
	count?: number
	locale?: string
}

export interface GeneratorOptions {
	count: number
	schema: Record<string, { category: keyof typeof fakerMethods; method: string }>
}

// Faker categories
export const fakerCategories = [
	"person",
	"internet",
	"location",
	"phone",
	"company",
	"lorem",
	"date",
	"number",
	"finance",
	"commerce",
	"color",
	"image",
	"word",
] as const

// Faker methods by category
export const fakerMethods: Record<string, string[]> = {
	person: ["fullName", "firstName", "lastName", "bio", "jobTitle", "jobType", "sex", "prefix", "suffix"],
	internet: ["email", "username", "password", "url", "avatar", "ip", "domainName", "userAgent"],
	location: ["city", "country", "state", "streetAddress", "zipCode", "latitude", "longitude"],
	phone: ["number", "imei"],
	company: ["name", "catchPhrase", "buzzPhrase"],
	lorem: ["word", "words", "sentence", "sentences", "paragraph", "paragraphs", "text"],
	date: ["past", "future", "recent", "soon", "birthdate"],
	number: ["int", "float", "binary", "octal", "hex"],
	finance: ["accountNumber", "amount", "currencyCode", "currencyName", "creditCardNumber"],
	commerce: ["department", "productName", "price", "productDescription", "productAdjective"],
	color: ["human", "rgb", "hsl", "hex"],
	image: ["url", "avatar", "abstract", "animals", "business"],
	word: ["noun", "verb", "adjective", "adverb", "conjunction"],
}

/**
 * Genera datos mock basados en la estructura del JSON
 */
export function generateMockData(template: unknown | GeneratorOptions, options: MockOptions = {}): unknown {
	// Check if template is GeneratorOptions
	if (typeof template === "object" && template !== null && "schema" in template && "count" in template) {
		const genOptions = template as GeneratorOptions
		return generateFromSchema(genOptions)
	}

	const { count = 1 } = options

	// Si el template es un array, generar múltiples items
	if (Array.isArray(template)) {
		if (template.length === 0) return []
		const itemTemplate = template[0]
		return Array.from({ length: count }, () => generateSingleMock(itemTemplate))
	}

	// Si count > 1 y es un objeto, generar array de objetos
	if (count > 1 && typeof template === "object" && template !== null) {
		return Array.from({ length: count }, () => generateSingleMock(template))
	}

	return generateSingleMock(template)
}

/**
 * Genera datos desde un schema con categorías y métodos
 */
function generateFromSchema(options: GeneratorOptions): unknown[] {
	const { count, schema } = options
	const results: unknown[] = []

	for (let i = 0; i < count; i++) {
		const item: Record<string, unknown> = {}

		for (const [fieldName, config] of Object.entries(schema)) {
			const { category, method } = config
			item[fieldName] = getFakerValue(category, method)
		}

		results.push(item)
	}

	return results
}

/**
 * Obtiene un valor de faker basado en categoría y método
 */
function getFakerValue(category: string, method: string): unknown {
	try {
		const categoryObj = faker[category as keyof typeof faker]
		if (categoryObj && typeof categoryObj === "object" && method in categoryObj) {
			const fn = (categoryObj as unknown as Record<string, () => unknown>)[method]
			if (typeof fn === "function") {
				return fn()
			}
		}
		// Fallback
		return faker.lorem.word()
	} catch {
		return faker.lorem.word()
	}
}

function generateSingleMock(template: unknown): unknown {
	if (template === null || template === undefined) return null

	if (typeof template === "string") {
		return inferStringValue(template)
	}

	if (typeof template === "number") {
		return Number.isInteger(template) ? faker.number.int({ min: 1, max: 10000 }) : faker.number.float({ min: 0, max: 1000, fractionDigits: 2 })
	}

	if (typeof template === "boolean") {
		return faker.datatype.boolean()
	}

	if (Array.isArray(template)) {
		if (template.length === 0) return []
		const itemTemplate = template[0]
		const length = faker.number.int({ min: 1, max: 5 })
		return Array.from({ length }, () => generateSingleMock(itemTemplate))
	}

	if (typeof template === "object") {
		const result: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(template as Record<string, unknown>)) {
			result[key] = inferFromKey(key, value)
		}
		return result
	}

	return template
}

/**
 * Infiere el valor basado en el nombre de la key
 */
function inferFromKey(key: string, originalValue: unknown): unknown {
	const keyLower = key.toLowerCase()

	// IDs
	if (keyLower === "id" || keyLower.endsWith("_id") || keyLower.endsWith("Id")) {
		return faker.string.uuid()
	}

	// Nombres
	if (keyLower === "name" || keyLower === "nombre") {
		return faker.person.fullName()
	}
	if (keyLower === "firstname" || keyLower === "first_name" || keyLower === "nombre") {
		return faker.person.firstName()
	}
	if (keyLower === "lastname" || keyLower === "last_name" || keyLower === "apellido") {
		return faker.person.lastName()
	}
	if (keyLower === "username") {
		return faker.internet.username()
	}

	// Contacto
	if (keyLower === "email" || keyLower === "correo") {
		return faker.internet.email()
	}
	if (keyLower === "phone" || keyLower === "telefono" || keyLower === "tel") {
		return faker.phone.number()
	}

	// Direcciones
	if (keyLower === "address" || keyLower === "direccion") {
		return faker.location.streetAddress()
	}
	if (keyLower === "city" || keyLower === "ciudad") {
		return faker.location.city()
	}
	if (keyLower === "country" || keyLower === "pais") {
		return faker.location.country()
	}
	if (keyLower === "zip" || keyLower === "zipcode" || keyLower === "postal") {
		return faker.location.zipCode()
	}
	if (keyLower === "state" || keyLower === "estado" || keyLower === "province") {
		return faker.location.state()
	}
	if (keyLower === "latitude" || keyLower === "lat") {
		return parseFloat(faker.location.latitude().toString())
	}
	if (keyLower === "longitude" || keyLower === "lng" || keyLower === "lon") {
		return parseFloat(faker.location.longitude().toString())
	}

	// Fechas
	if (keyLower.includes("date") || keyLower.includes("fecha") || keyLower === "createdat" || keyLower === "updatedat") {
		return faker.date.recent().toISOString()
	}
	if (keyLower === "birthday" || keyLower === "birthdate" || keyLower === "nacimiento") {
		return faker.date.birthdate().toISOString().split("T")[0]
	}

	// URLs e imágenes
	if (keyLower === "url" || keyLower === "website" || keyLower === "link") {
		return faker.internet.url()
	}
	if (keyLower === "image" || keyLower === "avatar" || keyLower === "photo" || keyLower === "picture" || keyLower === "img") {
		return faker.image.url()
	}

	// Texto
	if (keyLower === "title" || keyLower === "titulo") {
		return faker.lorem.sentence()
	}
	if (keyLower === "description" || keyLower === "descripcion" || keyLower === "bio") {
		return faker.lorem.paragraph()
	}
	if (keyLower === "content" || keyLower === "body" || keyLower === "text" || keyLower === "contenido") {
		return faker.lorem.paragraphs(2)
	}

	// Precios y dinero
	if (keyLower === "price" || keyLower === "precio" || keyLower === "amount" || keyLower === "cost") {
		return parseFloat(faker.commerce.price())
	}
	if (keyLower === "currency" || keyLower === "moneda") {
		return faker.finance.currencyCode()
	}

	// Trabajo
	if (keyLower === "company" || keyLower === "empresa") {
		return faker.company.name()
	}
	if (keyLower === "job" || keyLower === "position" || keyLower === "jobtitle" || keyLower === "cargo") {
		return faker.person.jobTitle()
	}

	// Colores
	if (keyLower === "color") {
		return faker.color.human()
	}

	// Otros
	if (keyLower === "status" || keyLower === "estado") {
		return faker.helpers.arrayElement(["active", "inactive", "pending", "completed"])
	}
	if (keyLower === "type" || keyLower === "tipo") {
		return faker.helpers.arrayElement(["type_a", "type_b", "type_c"])
	}
	if (keyLower === "category" || keyLower === "categoria") {
		return faker.commerce.department()
	}
	if (keyLower === "tags" || keyLower === "etiquetas") {
		return Array.from({ length: 3 }, () => faker.word.noun())
	}

	// Si no coincide, generar basado en el valor original
	return generateSingleMock(originalValue)
}

/**
 * Infiere un valor string basado en su contenido actual
 */
function inferStringValue(value: string): string {
	// Detectar patrones en el valor actual
	if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
		return faker.internet.email()
	}

	if (/^https?:\/\//.test(value)) {
		return faker.internet.url()
	}

	if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
		return faker.date.recent().toISOString()
	}

	if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
		return faker.string.uuid()
	}

	if (value.length > 100) {
		return faker.lorem.paragraph()
	}

	if (value.length > 30) {
		return faker.lorem.sentence()
	}

	return faker.lorem.words(2)
}

/**
 * Genera un esquema de ejemplo para testing
 */
export function generateSampleSchema(): object {
	return {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		phone: faker.phone.number(),
		address: {
			street: faker.location.streetAddress(),
			city: faker.location.city(),
			country: faker.location.country(),
			zipCode: faker.location.zipCode(),
		},
		company: faker.company.name(),
		jobTitle: faker.person.jobTitle(),
		avatar: faker.image.avatar(),
		createdAt: faker.date.past().toISOString(),
		isActive: faker.datatype.boolean(),
		tags: Array.from({ length: 3 }, () => faker.word.noun()),
	}
}
