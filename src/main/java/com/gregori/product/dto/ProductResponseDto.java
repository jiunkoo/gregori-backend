package com.gregori.product.dto;

import com.gregori.product.domain.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {

	private Long id;
	private Long sellerId;
	private String sellerName;
	private Long categoryId;
	private String categoryName;
	private String name;
	private String description;
	private Long price;
	private Long stock;
	private String imageUrl;
	private Product.Status status;
	private String createdAt;
	private String updatedAt;

	public ProductResponseDto toEntity(Product product) {

		return ProductResponseDto.builder()
			.id(product.getId())
			.sellerId(product.getSellerId())
			.sellerName("판매자") // 임시 값
			.categoryId(product.getCategoryId())
			.categoryName("카테고리") // 임시 값
			.name(product.getName())
			.description("상품 설명") // 임시 값
			.price(product.getPrice())
			.stock(product.getInventory())
			.imageUrl(product.getImageUrl())
			.status(product.getStatus())
			.createdAt(product.getCreatedAt().toString())
			.updatedAt(product.getUpdatedAt().toString())
			.build();
	}
}
