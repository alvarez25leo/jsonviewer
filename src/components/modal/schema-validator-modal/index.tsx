import { useState, useCallback } from "react"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import useJson from "@/store/useJson"
import { validateJsonSchema, generateSchemaFromJson, ValidationResult } from "@/lib/utils/schemaValidator"
import CopyComponent from "@/components/copy/copy.component"
import { toast } from "sonner"

export const SchemaValidatorModal = ({ opened, onClose }: modalProps) => {
	const getJson = useJson((state) => state.getJson)
	const [schema, setSchema] = useState("")
	const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
	const [generatedSchema, setGeneratedSchema] = useState("")

	const handleValidate = useCallback(() => {
		try {
			const jsonStr = getJson()
			const json = JSON.parse(jsonStr)
			const schemaObj = JSON.parse(schema)

			const result = validateJsonSchema(json, schemaObj)
			setValidationResult(result)

			if (result.valid) {
				toast.success("JSON is valid against the schema!")
			} else {
				toast.error(`Validation failed with ${result.errors.length} error(s)`)
			}
		} catch (err) {
			setValidationResult({
				valid: false,
				errors: [
					{
						path: "",
						message: `Parse error: ${err instanceof Error ? err.message : String(err)}`,
						keyword: "parse",
					},
				],
			})
		}
	}, [getJson, schema])

	const handleGenerateSchema = useCallback(() => {
		try {
			const jsonStr = getJson()
			const json = JSON.parse(jsonStr)
			const schemaObj = generateSchemaFromJson(json)
			const schemaStr = JSON.stringify(schemaObj, null, 2)
			setGeneratedSchema(schemaStr)
			setSchema(schemaStr)
			toast.success("Schema generated from JSON!")
		} catch (err) {
			toast.error(`Error generating schema: ${err}`)
		}
	}, [getJson])

	const loadSampleSchema = () => {
		const sampleSchema = {
			$schema: "http://json-schema.org/draft-07/schema#",
			type: "object",
			properties: {
				name: { type: "string", minLength: 1 },
				age: { type: "integer", minimum: 0 },
				email: { type: "string", format: "email" },
				tags: {
					type: "array",
					items: { type: "string" },
				},
			},
			required: ["name", "age"],
		}
		setSchema(JSON.stringify(sampleSchema, null, 2))
	}

	return (
		<ModalComponent
			openModal={opened}
			title="JSON Schema Validator"
			closeModal={onClose}
			style={{ minWidth: "700px", minHeight: "80vh" }}
		>
			<div className="flex flex-col gap-4">
				{/* Actions */}
				<div className="flex gap-2">
					<button
						onClick={handleGenerateSchema}
						className="flex-1 rounded-md bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
					>
						Generate Schema from JSON
					</button>
					<button
						onClick={loadSampleSchema}
						className="rounded-md bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700"
					>
						Load Sample Schema
					</button>
				</div>

				{/* Schema Input */}
				<div>
					<div className="mb-2 flex items-center justify-between">
						<label className="text-sm font-medium text-gray-300">JSON Schema</label>
						{schema && <CopyComponent value={schema} />}
					</div>
					<textarea
						value={schema}
						onChange={(e) => setSchema(e.target.value)}
						className="custom-scrollbar h-48 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 font-mono text-sm text-white"
						placeholder='{"type": "object", "properties": {...}}'
					/>
				</div>

				{/* Validate Button */}
				<button
					onClick={handleValidate}
					disabled={!schema}
					className={`w-full rounded-md px-4 py-2 font-medium transition-colors ${
						schema
							? "bg-blue-600 text-white hover:bg-blue-700"
							: "cursor-not-allowed bg-gray-700 text-gray-500"
					}`}
				>
					Validate JSON
				</button>

				{/* Validation Result */}
				{validationResult && (
					<div
						className={`rounded-md p-4 ${
							validationResult.valid ? "bg-green-900/30 border border-green-600" : "bg-red-900/30 border border-red-600"
						}`}
					>
						<div className="mb-2 flex items-center gap-2">
							<span className={`text-2xl ${validationResult.valid ? "text-green-400" : "text-red-400"}`}>
								{validationResult.valid ? "✓" : "✗"}
							</span>
							<span className={`font-medium ${validationResult.valid ? "text-green-300" : "text-red-300"}`}>
								{validationResult.valid ? "Valid" : "Invalid"}
							</span>
						</div>

						{validationResult.errors.length > 0 && (
							<div className="mt-3 space-y-2">
								<label className="text-sm font-medium text-gray-300">Errors:</label>
								{validationResult.errors.map((error, index) => (
									<div
										key={index}
										className="rounded-md bg-red-950 p-2 text-sm"
									>
										<div className="font-medium text-red-300">
											{error.path || "(root)"}
										</div>
										<div className="text-red-200">{error.message}</div>
										<div className="text-xs text-red-400">keyword: {error.keyword}</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Generated Schema */}
				{generatedSchema && (
					<details className="rounded-md bg-gray-800/50">
						<summary className="cursor-pointer p-3 text-sm font-medium text-gray-300">
							Generated Schema
						</summary>
						<pre className="custom-scrollbar max-h-[200px] overflow-auto p-3 font-mono text-xs text-gray-300">
							{generatedSchema}
						</pre>
					</details>
				)}

				{/* Schema Reference */}
				<details className="rounded-md bg-gray-800/50">
					<summary className="cursor-pointer p-3 text-sm font-medium text-gray-300">
						JSON Schema Quick Reference
					</summary>
					<div className="grid grid-cols-2 gap-2 p-3 text-xs">
						<code className="text-blue-300">type</code>
						<span className="text-gray-400">string, number, integer, boolean, array, object, null</span>
						<code className="text-blue-300">properties</code>
						<span className="text-gray-400">Define object properties</span>
						<code className="text-blue-300">required</code>
						<span className="text-gray-400">Array of required property names</span>
						<code className="text-blue-300">items</code>
						<span className="text-gray-400">Schema for array items</span>
						<code className="text-blue-300">minLength/maxLength</code>
						<span className="text-gray-400">String length constraints</span>
						<code className="text-blue-300">minimum/maximum</code>
						<span className="text-gray-400">Number value constraints</span>
						<code className="text-blue-300">pattern</code>
						<span className="text-gray-400">Regex pattern for strings</span>
						<code className="text-blue-300">enum</code>
						<span className="text-gray-400">Allowed values</span>
					</div>
				</details>
			</div>
		</ModalComponent>
	)
}
