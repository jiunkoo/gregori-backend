package com.gregori.product.dto;

import com.gregori.category.domain.Category;
import com.gregori.product.domain.Product;
import com.gregori.seller.domain.Seller;

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
			.categoryId(product.getCategoryId())
			.name(product.getName())
			.price(product.getPrice())
			.stock(product.getInventory())
			.imageUrl(product.getImageUrl())
			.status(product.getStatus())
			.createdAt(product.getCreatedAt().toString())
			.updatedAt(product.getUpdatedAt().toString())
			.build();
	}

	public ProductResponseDto toEntity(Product product, Category category, Seller seller) {

		return ProductResponseDto.builder()
			.id(product.getId())
			.sellerId(product.getSellerId())
			.sellerName(seller != null ? seller.getBusinessName() : null)
			.categoryId(product.getCategoryId())
			.categoryName(category != null ? category.getName() : null)
			.name(product.getName())
			.price(product.getPrice())
			.stock(product.getInventory())
			.imageUrl(product.getImageUrl())
			.status(product.getStatus())
			.createdAt(product.getCreatedAt().toString())
			.updatedAt(product.getUpdatedAt().toString())
			.build();
	}
}
