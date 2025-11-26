/**
 * Predefined JSON Templates
 * Common structures for various use cases
 */

export interface Template {
	id: string
	name: string
	description: string
	category: TemplateCategory
	tags: string[]
	content: object
	isCustom?: boolean
	createdAt?: string
}

export type TemplateCategory =
	| "api"
	| "config"
	| "schema"
	| "data"
	| "testing"
	| "ecommerce"
	| "user"
	| "custom"

export const categoryLabels: Record<TemplateCategory, string> = {
	api: "API Responses",
	config: "Configuration",
	schema: "Schemas",
	data: "Data Structures",
	testing: "Testing & Mocks",
	ecommerce: "E-Commerce",
	user: "User & Auth",
	custom: "My Templates",
}

export const categoryIcons: Record<TemplateCategory, string> = {
	api: "🌐",
	config: "⚙️",
	schema: "📋",
	data: "📊",
	testing: "🧪",
	ecommerce: "🛒",
	user: "👤",
	custom: "⭐",
}

export const predefinedTemplates: Template[] = [
	// API Responses
	{
		id: "api-success",
		name: "API Success Response",
		description: "Standard successful API response with data",
		category: "api",
		tags: ["api", "response", "success", "rest"],
		content: {
			success: true,
			status: 200,
			message: "Operation completed successfully",
			data: {
				id: 1,
				name: "Sample Item",
				createdAt: "2024-01-15T10:30:00Z",
			},
			meta: {
				requestId: "req_abc123",
				timestamp: "2024-01-15T10:30:00Z",
			},
		},
	},
	{
		id: "api-error",
		name: "API Error Response",
		description: "Standard error response with details",
		category: "api",
		tags: ["api", "response", "error", "rest"],
		content: {
			success: false,
			status: 400,
			error: {
				code: "VALIDATION_ERROR",
				message: "Invalid request parameters",
				details: [
					{ field: "email", message: "Invalid email format" },
					{ field: "age", message: "Must be a positive number" },
				],
			},
			meta: {
				requestId: "req_xyz789",
				timestamp: "2024-01-15T10:30:00Z",
			},
		},
	},
	{
		id: "api-paginated",
		name: "Paginated API Response",
		description: "API response with pagination metadata",
		category: "api",
		tags: ["api", "pagination", "list", "rest"],
		content: {
			success: true,
			data: [
				{ id: 1, name: "Item 1" },
				{ id: 2, name: "Item 2" },
				{ id: 3, name: "Item 3" },
			],
			pagination: {
				page: 1,
				pageSize: 10,
				totalItems: 150,
				totalPages: 15,
				hasNext: true,
				hasPrev: false,
			},
		},
	},
	{
		id: "graphql-response",
		name: "GraphQL Response",
		description: "Standard GraphQL query response",
		category: "api",
		tags: ["graphql", "api", "response"],
		content: {
			data: {
				user: {
					id: "user_123",
					name: "John Doe",
					email: "john@example.com",
					posts: {
						edges: [
							{ node: { id: "post_1", title: "First Post" } },
							{ node: { id: "post_2", title: "Second Post" } },
						],
						pageInfo: {
							hasNextPage: true,
							endCursor: "cursor_abc",
						},
					},
				},
			},
		},
	},

	// Configuration
	{
		id: "package-json",
		name: "Package.json",
		description: "Node.js package.json template",
		category: "config",
		tags: ["npm", "node", "package", "config"],
		content: {
			name: "my-project",
			version: "1.0.0",
			description: "Project description",
			main: "index.js",
			scripts: {
				start: "node index.js",
				dev: "nodemon index.js",
				test: "jest",
				build: "tsc",
			},
			dependencies: {},
			devDependencies: {},
			keywords: [],
			author: "Your Name",
			license: "MIT",
		},
	},
	{
		id: "tsconfig",
		name: "TypeScript Config",
		description: "tsconfig.json for TypeScript projects",
		category: "config",
		tags: ["typescript", "config", "tsconfig"],
		content: {
			compilerOptions: {
				target: "ES2022",
				module: "ESNext",
				moduleResolution: "bundler",
				strict: true,
				esModuleInterop: true,
				skipLibCheck: true,
				forceConsistentCasingInFileNames: true,
				outDir: "./dist",
				rootDir: "./src",
				declaration: true,
				declarationMap: true,
				sourceMap: true,
			},
			include: ["src/**/*"],
			exclude: ["node_modules", "dist"],
		},
	},
	{
		id: "eslint-config",
		name: "ESLint Config",
		description: "ESLint configuration file",
		category: "config",
		tags: ["eslint", "linting", "config"],
		content: {
			env: {
				browser: true,
				es2022: true,
				node: true,
			},
			extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
			plugins: ["@typescript-eslint"],
			rules: {
				"no-unused-vars": "warn",
				"no-console": "warn",
			},
		},
	},
	{
		id: "docker-compose",
		name: "Docker Compose",
		description: "Docker Compose configuration",
		category: "config",
		tags: ["docker", "compose", "container", "config"],
		content: {
			version: "3.8",
			services: {
				app: {
					build: ".",
					ports: ["3000:3000"],
					environment: {
						NODE_ENV: "production",
						DATABASE_URL: "postgres://user:pass@db:5432/mydb",
					},
					depends_on: ["db"],
				},
				db: {
					image: "postgres:15",
					environment: {
						POSTGRES_USER: "user",
						POSTGRES_PASSWORD: "pass",
						POSTGRES_DB: "mydb",
					},
					volumes: ["postgres_data:/var/lib/postgresql/data"],
				},
			},
			volumes: {
				postgres_data: {},
			},
		},
	},

	// Schemas
	{
		id: "json-schema-object",
		name: "JSON Schema - Object",
		description: "JSON Schema for validating objects",
		category: "schema",
		tags: ["json-schema", "validation", "object"],
		content: {
			$schema: "http://json-schema.org/draft-07/schema#",
			type: "object",
			properties: {
				id: { type: "integer", minimum: 1 },
				name: { type: "string", minLength: 1, maxLength: 100 },
				email: { type: "string", format: "email" },
				age: { type: "integer", minimum: 0, maximum: 150 },
				isActive: { type: "boolean" },
				tags: {
					type: "array",
					items: { type: "string" },
					uniqueItems: true,
				},
			},
			required: ["id", "name", "email"],
			additionalProperties: false,
		},
	},
	{
		id: "openapi-endpoint",
		name: "OpenAPI Endpoint",
		description: "OpenAPI/Swagger endpoint definition",
		category: "schema",
		tags: ["openapi", "swagger", "api", "documentation"],
		content: {
			"/users/{id}": {
				get: {
					summary: "Get user by ID",
					description: "Returns a single user",
					operationId: "getUserById",
					tags: ["Users"],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "integer" },
							description: "User ID",
						},
					],
					responses: {
						"200": {
							description: "Successful response",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/User" },
								},
							},
						},
						"404": {
							description: "User not found",
						},
					},
				},
			},
		},
	},

	// Data Structures
	{
		id: "tree-structure",
		name: "Tree Structure",
		description: "Recursive tree/folder structure",
		category: "data",
		tags: ["tree", "hierarchy", "recursive", "folder"],
		content: {
			id: "root",
			name: "Root",
			type: "folder",
			children: [
				{
					id: "folder1",
					name: "Documents",
					type: "folder",
					children: [
						{ id: "file1", name: "Report.pdf", type: "file", size: 1024 },
						{ id: "file2", name: "Notes.txt", type: "file", size: 256 },
					],
				},
				{
					id: "folder2",
					name: "Images",
					type: "folder",
					children: [{ id: "file3", name: "Photo.jpg", type: "file", size: 2048 }],
				},
			],
		},
	},
	{
		id: "geojson",
		name: "GeoJSON Feature",
		description: "GeoJSON feature with geometry",
		category: "data",
		tags: ["geojson", "geo", "map", "location"],
		content: {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					properties: {
						name: "Sample Location",
						category: "landmark",
					},
					geometry: {
						type: "Point",
						coordinates: [-73.9857, 40.7484],
					},
				},
				{
					type: "Feature",
					properties: {
						name: "Sample Area",
						category: "zone",
					},
					geometry: {
						type: "Polygon",
						coordinates: [
							[
								[-73.99, 40.75],
								[-73.98, 40.75],
								[-73.98, 40.74],
								[-73.99, 40.74],
								[-73.99, 40.75],
							],
						],
					},
				},
			],
		},
	},
	{
		id: "event-payload",
		name: "Event Payload",
		description: "Event-driven architecture payload",
		category: "data",
		tags: ["event", "message", "queue", "pubsub"],
		content: {
			eventId: "evt_123abc",
			eventType: "user.created",
			version: "1.0",
			timestamp: "2024-01-15T10:30:00Z",
			source: "user-service",
			data: {
				userId: "usr_456",
				email: "newuser@example.com",
				plan: "premium",
			},
			metadata: {
				correlationId: "corr_789",
				traceId: "trace_012",
			},
		},
	},

	// User & Auth
	{
		id: "user-profile",
		name: "User Profile",
		description: "Complete user profile object",
		category: "user",
		tags: ["user", "profile", "account"],
		content: {
			id: "usr_123456",
			email: "john.doe@example.com",
			username: "johndoe",
			profile: {
				firstName: "John",
				lastName: "Doe",
				avatar: "https://example.com/avatars/johndoe.jpg",
				bio: "Software developer passionate about clean code",
				location: "San Francisco, CA",
				website: "https://johndoe.dev",
			},
			settings: {
				theme: "dark",
				language: "en",
				timezone: "America/Los_Angeles",
				notifications: {
					email: true,
					push: true,
					sms: false,
				},
			},
			subscription: {
				plan: "premium",
				status: "active",
				expiresAt: "2025-01-15T00:00:00Z",
			},
			createdAt: "2023-01-15T10:30:00Z",
			updatedAt: "2024-01-10T15:45:00Z",
		},
	},
	{
		id: "jwt-payload",
		name: "JWT Payload",
		description: "JSON Web Token payload structure",
		category: "user",
		tags: ["jwt", "auth", "token", "security"],
		content: {
			sub: "usr_123456",
			iss: "https://auth.example.com",
			aud: "https://api.example.com",
			exp: 1705312200,
			iat: 1705225800,
			nbf: 1705225800,
			jti: "token_unique_id",
			scope: "read write",
			roles: ["user", "admin"],
			permissions: ["users:read", "users:write", "posts:read"],
		},
	},
	{
		id: "oauth-token",
		name: "OAuth Token Response",
		description: "OAuth 2.0 token response",
		category: "user",
		tags: ["oauth", "auth", "token"],
		content: {
			access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
			token_type: "Bearer",
			expires_in: 3600,
			refresh_token: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
			scope: "openid profile email",
			id_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
		},
	},

	// E-Commerce
	{
		id: "product",
		name: "Product",
		description: "E-commerce product object",
		category: "ecommerce",
		tags: ["product", "ecommerce", "shop", "catalog"],
		content: {
			id: "prod_789",
			sku: "SKU-001-BLK-L",
			name: "Premium T-Shirt",
			slug: "premium-t-shirt",
			description: "High-quality cotton t-shirt",
			price: {
				amount: 29.99,
				currency: "USD",
				compareAt: 39.99,
			},
			images: [
				{ url: "https://example.com/img1.jpg", alt: "Front view", isPrimary: true },
				{ url: "https://example.com/img2.jpg", alt: "Back view", isPrimary: false },
			],
			variants: [
				{ id: "var_1", size: "S", color: "Black", stock: 10 },
				{ id: "var_2", size: "M", color: "Black", stock: 15 },
				{ id: "var_3", size: "L", color: "Black", stock: 8 },
			],
			categories: ["clothing", "t-shirts"],
			tags: ["premium", "cotton", "unisex"],
			metadata: {
				weight: 0.3,
				dimensions: { length: 70, width: 50, height: 2, unit: "cm" },
			},
			status: "active",
			createdAt: "2024-01-01T00:00:00Z",
		},
	},
	{
		id: "order",
		name: "Order",
		description: "E-commerce order object",
		category: "ecommerce",
		tags: ["order", "ecommerce", "purchase"],
		content: {
			id: "ord_456",
			orderNumber: "ORD-2024-0001",
			status: "processing",
			customer: {
				id: "cust_123",
				email: "customer@example.com",
				name: "Jane Smith",
			},
			items: [
				{
					productId: "prod_789",
					name: "Premium T-Shirt",
					quantity: 2,
					unitPrice: 29.99,
					total: 59.98,
				},
			],
			shipping: {
				method: "express",
				address: {
					line1: "123 Main St",
					line2: "Apt 4B",
					city: "New York",
					state: "NY",
					postalCode: "10001",
					country: "US",
				},
				cost: 9.99,
				estimatedDelivery: "2024-01-20",
			},
			payment: {
				method: "card",
				status: "paid",
				transactionId: "txn_abc123",
			},
			totals: {
				subtotal: 59.98,
				shipping: 9.99,
				tax: 5.25,
				discount: 0,
				total: 75.22,
			},
			createdAt: "2024-01-15T14:30:00Z",
		},
	},
	{
		id: "cart",
		name: "Shopping Cart",
		description: "Shopping cart object",
		category: "ecommerce",
		tags: ["cart", "ecommerce", "shopping"],
		content: {
			id: "cart_789",
			customerId: "cust_123",
			items: [
				{
					productId: "prod_001",
					variantId: "var_001",
					name: "Product Name",
					quantity: 2,
					unitPrice: 19.99,
					total: 39.98,
				},
			],
			coupon: {
				code: "SAVE10",
				discount: 10,
				type: "percentage",
			},
			totals: {
				itemCount: 2,
				subtotal: 39.98,
				discount: 4.0,
				total: 35.98,
			},
			expiresAt: "2024-01-22T14:30:00Z",
			updatedAt: "2024-01-15T14:30:00Z",
		},
	},

	// Testing
	{
		id: "test-fixture",
		name: "Test Fixture",
		description: "Test data fixture with various types",
		category: "testing",
		tags: ["test", "fixture", "mock", "data"],
		content: {
			string: "Hello World",
			number: 42,
			float: 3.14159,
			boolean: true,
			null: null,
			array: [1, 2, 3, 4, 5],
			object: {
				nested: {
					deep: {
						value: "found",
					},
				},
			},
			date: "2024-01-15T10:30:00Z",
			email: "test@example.com",
			url: "https://example.com",
			uuid: "550e8400-e29b-41d4-a716-446655440000",
			emptyArray: [],
			emptyObject: {},
			specialChars: "Hello \"World\" with 'quotes' and <tags>",
			unicode: "Hello 世界 🌍",
			longText:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		},
	},
	{
		id: "mock-users",
		name: "Mock Users Array",
		description: "Array of mock user objects for testing",
		category: "testing",
		tags: ["mock", "users", "array", "test"],
		content: {
			users: [
				{ id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin" },
				{ id: 2, name: "Bob Smith", email: "bob@example.com", role: "user" },
				{ id: 3, name: "Carol White", email: "carol@example.com", role: "user" },
				{ id: 4, name: "David Brown", email: "david@example.com", role: "moderator" },
				{ id: 5, name: "Eve Davis", email: "eve@example.com", role: "user" },
			],
		},
	},
]

/**
 * Get all categories that have templates
 */
export function getTemplateCategories(): TemplateCategory[] {
	return Object.keys(categoryLabels) as TemplateCategory[]
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory, customTemplates: Template[] = []): Template[] {
	if (category === "custom") {
		return customTemplates
	}
	return predefinedTemplates.filter((t) => t.category === category)
}

/**
 * Search templates by query
 */
export function searchTemplates(query: string, customTemplates: Template[] = []): Template[] {
	const allTemplates = [...predefinedTemplates, ...customTemplates]
	const lowerQuery = query.toLowerCase()

	return allTemplates.filter(
		(t) =>
			t.name.toLowerCase().includes(lowerQuery) ||
			t.description.toLowerCase().includes(lowerQuery) ||
			t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
	)
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string, customTemplates: Template[] = []): Template | undefined {
	return predefinedTemplates.find((t) => t.id === id) || customTemplates.find((t) => t.id === id)
}

/**
 * Generate unique ID for custom templates
 */
export function generateTemplateId(): string {
	return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
