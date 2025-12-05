package com.venta.backend.cliente.application.mappers;

import com.venta.backend.cliente.application.dto.response.ClienteResponse;
import com.venta.backend.cliente.entities.Cliente;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-05T02:31:32-0500",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class IClienteMapeadorImpl implements IClienteMapeador {

    @Override
    public ClienteResponse toClienteResponse(Cliente cliente) {
        if ( cliente == null ) {
            return null;
        }

        ClienteResponse.ClienteResponseBuilder clienteResponse = ClienteResponse.builder();

        clienteResponse.fullName( cliente.getFullName() );
        if ( cliente.getEstado() != null ) {
            clienteResponse.estado( cliente.getEstado().name() );
        }
        clienteResponse.clienteId( cliente.getClienteId() );
        clienteResponse.dni( cliente.getDni() );
        clienteResponse.firstName( cliente.getFirstName() );
        clienteResponse.lastName( cliente.getLastName() );
        clienteResponse.email( cliente.getEmail() );
        clienteResponse.phoneNumber( cliente.getPhoneNumber() );
        clienteResponse.telefonoFijo( cliente.getTelefonoFijo() );
        clienteResponse.address( cliente.getAddress() );
        clienteResponse.fechaNacimiento( cliente.getFechaNacimiento() );
        clienteResponse.registrationDate( cliente.getRegistrationDate() );
        clienteResponse.categoria( cliente.getCategoria() );

        return clienteResponse.build();
    }

    @Override
    public List<ClienteResponse> toClienteResponseList(List<Cliente> clientes) {
        if ( clientes == null ) {
            return null;
        }

        List<ClienteResponse> list = new ArrayList<ClienteResponse>( clientes.size() );
        for ( Cliente cliente : clientes ) {
            list.add( toClienteResponse( cliente ) );
        }

        return list;
    }
}
