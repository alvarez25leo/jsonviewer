// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FileFormat } from "@/enums/file.enum"
import { parse } from "jsonc-parser"
import { csv2json, json2csv } from "json-2-csv"

const keyExists = (obj: object, key: string) => {
	if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
		return false
	} else if (obj.hasOwnProperty(key)) {
		return obj[key]
	} else if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			const result = keyExists(obj[i], key)

			if (result) {
				return result
			}
		}
	} else {
		for (const k in obj) {
			const result = keyExists(obj[k], key)

			if (result) {
				return result
			}
		}
	}

	return false
}

const contentToJson = async (value: string, format = FileFormat.JSON): Promise<object> => {
	// eslint-disable-next-line no-useless-catch
	try {
		let json: object = {}

		if (format === FileFormat.JSON) json = parse(value)
		if (format === FileFormat.CSV) json = csv2json(value)
		if (format === FileFormat.XML && keyExists(json, "parsererror")) throw Error("Unknown error!")

		if (!json) throw Error("Invalid JSON!")

		return Promise.resolve(json)
	} catch (error: any) {
		throw error
	}
}

const jsonToContent = async (json: string, format: FileFormat): Promise<string> => {
	// eslint-disable-next-line no-useless-catch
	try {
		let contents = json

		if (!json) return json
		if (format === FileFormat.JSON) contents = json
		if (format === FileFormat.CSV) contents = json2csv(parse(json))

		return Promise.resolve(contents)
	} catch (error: any) {
		throw error
	}
}

export { contentToJson, jsonToContent }
