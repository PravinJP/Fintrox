package com.app.Fintrox.collection.service;



import com.app.Fintrox.collection.dto.request.CollectionRequest;
import com.app.Fintrox.collection.dto.response.CollectionResponse;

import java.util.List;

public interface CollectionService {

    CollectionResponse recordCollection(CollectionRequest request, Long userId, Long organizationId, Long employeeId);

    CollectionResponse getCollectionById(Long id);

    List<CollectionResponse> getCollectionsByLoan(Long loanId);

    List<CollectionResponse> getCollectionsByCustomer(Long customerId);

    List<CollectionResponse> getCollectionsByEmployee(Long employeeId);

    List<CollectionResponse> getTodayCollections(Long organizationId);

    CollectionResponse verifyCollection(Long collectionId);

    CollectionResponse generateReceipt(Long collectionId);

    List<CollectionResponse> getCollectionsByOrganization(Long organizationId);
}
