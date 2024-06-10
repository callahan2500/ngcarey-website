import { siteConfig } from "@/site-config";
import { type CollectionEntry, getCollection } from "astro:content";

/** Filter out draft teaching posts based on the environment */
export async function getAllTeachingPosts() {
	return await getCollection("teaching", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

/** Returns the date of the teaching post based on option in siteConfig.sortPostsByUpdatedDate */
export function getTeachingSortDate(post: CollectionEntry<"teaching">) {
	return siteConfig.sortPostsByUpdatedDate && post.data.updatedDate !== undefined
		? new Date(post.data.updatedDate)
		: new Date(post.data.publishDate);
}

/** Sort teaching posts by date (by siteConfig.sortPostsByUpdatedDate), desc. */
export function sortTeachingMDByDate(posts: CollectionEntry<"teaching">[]) {
	return posts.sort((a, b) => {
		const aDate = getTeachingSortDate(a).valueOf();
		const bDate = getTeachingSortDate(b).valueOf();
		return bDate - aDate;
	});
}

/** Groups teaching posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllTeachingPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"teaching">[]) {
	return posts.reduce<Record<string, CollectionEntry<"teaching">[]>>((acc, post) => {
		const year = getTeachingSortDate(post).getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year]?.push(post);
		return acc;
	}, {});
}

/** Returns all tags created from teaching posts (inc duplicate tags)
 *  Note: This function doesn't filter draft teaching posts, pass it the result of getAllTeachingPosts above to do so.
 */
export function getAllTags(posts: CollectionEntry<"teaching">[]) {
	return posts.flatMap((post) => [...post.data.tags]);
}

/** Returns all unique tags created from teaching posts
 *  Note: This function doesn't filter draft teaching posts, pass it the result of getAllTeachingPosts above to do so.
 */
export function getUniqueTags(posts: CollectionEntry<"teaching">[]) {
	return [...new Set(getAllTags(posts))];
}

/** Returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter draft teaching posts, pass it the result of getAllTeachingPosts above to do so.
 */
export function getUniqueTagsWithCount(posts: CollectionEntry<"teaching">[]): [string, number][] {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}
