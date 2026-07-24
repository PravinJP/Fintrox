package com.app.Fintrox.organization.service;



import com.app.Fintrox.organization.dto.request.OrganizationRequest;
import com.app.Fintrox.organization.dto.response.OrganizationResponse;
import com.app.Fintrox.organization.entity.Organization;
import com.app.Fintrox.organization.mapper.OrganizationMapper;
import com.app.Fintrox.organization.repository.OrganizationRepository;
import com.app.Fintrox.Auth.entity.User;

import com.app.Fintrox.Auth.repository.UserRepository;
import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.ResourceNotFoundException;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import com.app.Fintrox.security.permissions.UserType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final OrganizationMapper organizationMapper;

    @Override
    @Transactional
    public OrganizationResponse createOrganization(OrganizationRequest request, Long ownerId) {
        // 1. Validate owner exists
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. Check if user is an OWNER
        if (owner.getUserType() != UserType.OWNER && owner.getUserType() != UserType.INDIVIDUAL_LENDER) {
            throw new UnauthorizedException("Only owners can create organizations");
        }

        // 3. Check if owner already has an organization
        if (organizationRepository.existsByOwnerId(ownerId)) {
            throw new BadRequestException("You already have an organization registered");
        }

        // 4. Validate email uniqueness
        if (organizationRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered by another organization");
        }

        // 5. Validate phone uniqueness
        if (organizationRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number already registered by another organization");
        }

        // 6. Validate GST if provided
        if (request.getGst() != null && !request.getGst().isEmpty()) {
            if (organizationRepository.existsByGst(request.getGst())) {
                throw new BadRequestException("GST number already registered");
            }
        }

        // 7. Create organization
        Organization organization = organizationMapper.toEntity(request, ownerId);
        Organization savedOrganization = organizationRepository.save(organization);

        // 8. Update owner's organization ID
        owner.setOrganizationId(savedOrganization.getId());
        userRepository.save(owner);

        log.info("Organization created: {} by owner: {}", savedOrganization.getName(), owner.getEmail());

        return organizationMapper.toResponseWithOwner(savedOrganization, owner);
    }

    @Override
    public OrganizationResponse getOrganizationById(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        User owner = userRepository.findById(organization.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        return organizationMapper.toResponseWithOwner(organization, owner);
    }

    @Override
    public OrganizationResponse getOrganizationByOwnerId(Long ownerId) {
        Organization organization = organizationRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found for this owner"));

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        return organizationMapper.toResponseWithOwner(organization, owner);
    }

    @Override
    public Organization getOrganizationEntityByOwnerId(Long ownerId) {
        return organizationRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found for this owner"));
    }

    @Override
    public List<OrganizationResponse> getAllOrganizations() {
        List<Organization> organizations = organizationRepository.findAll();
        return organizations.stream()
                .map(org -> {
                    User owner = userRepository.findById(org.getOwnerId()).orElse(null);
                    if (owner != null) {
                        return organizationMapper.toResponseWithOwner(org, owner);
                    }
                    return organizationMapper.toResponse(org);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<OrganizationResponse> getActiveOrganizations() {
        List<Organization> organizations = organizationRepository.findByIsActiveTrue();
        return organizations.stream()
                .map(org -> {
                    User owner = userRepository.findById(org.getOwnerId()).orElse(null);
                    if (owner != null) {
                        return organizationMapper.toResponseWithOwner(org, owner);
                    }
                    return organizationMapper.toResponse(org);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrganizationResponse updateOrganization(Long id, OrganizationRequest request, Long ownerId) {
        // 1. Find organization
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        // 2. Verify owner owns this organization
        if (!organization.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You don't have permission to update this organization");
        }

        // 3. Validate email if changed
        if (request.getEmail() != null && !request.getEmail().equals(organization.getEmail())) {
            if (organizationRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already registered by another organization");
            }
        }

        // 4. Validate phone if changed
        if (request.getPhone() != null && !request.getPhone().equals(organization.getPhone())) {
            if (organizationRepository.existsByPhone(request.getPhone())) {
                throw new BadRequestException("Phone number already registered by another organization");
            }
        }

        // 5. Validate GST if changed
        if (request.getGst() != null && !request.getGst().isEmpty()) {
            if (!request.getGst().equals(organization.getGst())) {
                if (organizationRepository.existsByGst(request.getGst())) {
                    throw new BadRequestException("GST number already registered");
                }
            }
        }

        // 6. Update organization
        organizationMapper.updateEntity(request, organization);
        Organization updatedOrganization = organizationRepository.save(organization);

        log.info("Organization updated: {} by owner: {}", updatedOrganization.getName(), ownerId);

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        return organizationMapper.toResponseWithOwner(updatedOrganization, owner);
    }

    @Override
    @Transactional
    public void activateOrganization(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        organization.setActive(true);
        organizationRepository.save(organization);

        log.info("Organization activated: {}", organization.getName());
    }

    @Override
    @Transactional
    public void deactivateOrganization(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        organization.setActive(false);
        organizationRepository.save(organization);

        log.info("Organization deactivated: {}", organization.getName());
    }

    @Override
    public boolean hasOrganization(Long ownerId) {
        return organizationRepository.existsByOwnerId(ownerId);
    }

    @Override
    public OrganizationResponse getOrganizationDashboard(Long ownerId) {
        Organization organization = organizationRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        // TODO: Get counts from other modules (will implement after they are created)
        // For now, return with zeros
        return organizationMapper.toResponseWithCounts(
                organization,
                0L,  // employeeCount
                0L,  // customerCount
                0L,  // loanCount
                0.0  // totalCollection
        );
    }

    @Override
    public List<OrganizationResponse> searchOrganizations(String searchTerm) {
        List<Organization> organizations = organizationRepository.searchOrganizations(searchTerm);
        return organizations.stream()
                .map(org -> {
                    User owner = userRepository.findById(org.getOwnerId()).orElse(null);
                    if (owner != null) {
                        return organizationMapper.toResponseWithOwner(org, owner);
                    }
                    return organizationMapper.toResponse(org);
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean organizationExists(Long id) {
        return organizationRepository.existsById(id);
    }

    @Override
    public Organization getOrganizationEntityById(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
    }
}
